import React, { FC, useState } from "react"
import * as Sentry from "@sentry/node"
import Button from "../Button/Button"
import Markdown from "../Markdown/Markdown"
import Textarea from "../Textarea/Textarea"
import usePostPlanObservation from "../../hooks/api/usePostPlanObservation"
import dayjs, { Dayjs } from "../../utils/dayjs"
import usePatchObservation from "../../hooks/api/usePatchObservation"
import useDeleteObservation from "../../hooks/api/useDeleteObservation"
import Dialog from "../Dialog/Dialog"
import Icon from "../Icon/Icon"

interface Props {
  planId: string
  childId: string
  name: string
  area: string
  description?: string
  files: Array<{
    link: string
    name: string
  }>
  links: Array<{
    id: string
    url: string
    title?: string
    description?: string
    image?: string
  }>
  observations: Array<{
    id: string
    observation: string
    createdAt: string
  }>
}

const Plan: FC<Props> = ({
  childId,
  planId,
  name,
  area,
  files,
  description,
  links,
  observations,
}) => {
  const [showAddObservationForm, setShowAddObservationForm] = useState(false)

  return (
    <div className="flex flex-col items-start bg-surface md:rounded mb-2 border py-3">
      {area && <div className="text-sm text-green-700 px-3 mb-2">{area}</div>}
      <div className="text-md px-3 font-bold">{name}</div>
      <Markdown
        className="text-gray-700 my-2 px-3"
        markdown={description ?? ""}
      />
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          className="overflow-x-auto max-w-full px-3 py-2 flex items-center text-sm leading-tight block"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon src="/icons/link.svg" className="flex-shrink-0" size={16} />
          <div className="whitespace-no-wrap ml-2">{link.url}</div>
        </a>
      ))}
      {files.length > 0 && (
        <div className="text-sm text-gray-700 mb-1">Files</div>
      )}
      {showAddObservationForm ? (
        <AddObservationForm
          planId={planId}
          childId={childId}
          onDismiss={() => setShowAddObservationForm(false)}
        />
      ) : (
        <Button
          outline
          className="ml-auto mr-3 mt-3"
          onClick={() => setShowAddObservationForm(true)}
        >
          Add observation
        </Button>
      )}
      {observations.length > 0 && (
        <div className="mx-3 text-sm">Observations</div>
      )}
      {observations.map(({ id, observation, createdAt }) => (
        <Observation
          key={id}
          id={id}
          createdAt={dayjs(createdAt)}
          observation={observation}
        />
      ))}
    </div>
  )
}

const AddObservationForm: FC<{
  onDismiss: () => void
  planId: string
  childId: string
}> = ({ onDismiss, planId, childId }) => {
  const [loading, setLoading] = useState(false)
  const postObservation = usePostPlanObservation(planId)
  const [observation, setObservation] = useState("")

  return (
    <>
      <div className="px-3 w-full">
        <Textarea
          className="w-full mt-3"
          label="Observation"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex ml-auto">
        <Button
          outline
          className="ml-auto mr-3 mt-3"
          onClick={onDismiss}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="ml-auto mr-3 mt-3"
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true)
              await postObservation.mutateAsync({
                observation,
                childId,
              })
              onDismiss()
            } catch (e) {
              Sentry.captureException(e)
            } finally {
              setLoading(false)
            }
          }}
        >
          {loading ? "Loading" : "Post"}
        </Button>
      </div>
    </>
  )
}

const Observation: FC<{
  id: string
  observation: string
  createdAt: Dayjs
}> = ({ id, observation, createdAt }) => {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="px-3 mt-2 text-gray-700 flex w-full">
      <div className="rounded-full bg-black w-1 flex-shrink-0 mr-3" />
      <div className="w-full">
        {isEditing && (
          <EditObservationForm
            observationId={id}
            original={observation}
            onDismiss={() => setIsEditing(false)}
          />
        )}
        {!isEditing && (
          <>
            <Markdown markdown={observation} />
            <div className="flex mt-2 item-center w-full">
              <div className="text-sm">{createdAt.format("HH:mm")}</div>
              <Button
                outline
                className="ml-auto mr-3 text-sm underline cursor-pointer border-none p-0"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const EditObservationForm: FC<{
  observationId: string
  onDismiss: () => void
  original: string
}> = ({ observationId, original, onDismiss }) => {
  const patchObservation = usePatchObservation(observationId)
  const deleteObservation = useDeleteObservation(observationId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [observation, setObservation] = useState(original)

  return (
    <>
      <Textarea
        label="Edit observation"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
      />
      <div className="flex mt-2">
        <Button
          data-cy="delete-observation"
          iconOnly
          outline
          className="mr-2 text-red-700 px-2"
          onClick={() => setShowDeleteDialog(true)}
          disabled={patchObservation.isLoading}
        >
          <Icon src="/icons/trash.svg" />
        </Button>
        <Button
          outline
          className="ml-auto mr-2"
          onClick={onDismiss}
          disabled={patchObservation.isLoading}
        >
          Cancel
        </Button>
        <Button
          disabled={observation === original || patchObservation.isLoading}
          onClick={async () => {
            try {
              await patchObservation.mutateAsync({ observation })
              onDismiss()
            } catch (e) {
              Sentry.captureException(e)
            }
          }}
        >
          {patchObservation.isLoading ? "Loading" : "Save"}
        </Button>
      </div>
      {showDeleteDialog && (
        <Dialog>
          <div className="text-xl mx-6 mb-6 mt-3">Delete this observation?</div>
          <div className="flex w-full">
            <Button
              outline
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteObservation.isLoading}
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-red-700 text-white ml-2"
              onClick={async () => {
                try {
                  await deleteObservation.mutateAsync()
                  onDismiss()
                } catch (e) {
                  Sentry.captureException(e)
                }
              }}
              disabled={deleteObservation.isLoading}
            >
              {deleteObservation.isLoading ? "Loading" : "Yes"}
            </Button>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default Plan
