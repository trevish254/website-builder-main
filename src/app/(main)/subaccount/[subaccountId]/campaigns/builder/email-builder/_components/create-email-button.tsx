'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/global/custom-modal'
import CreateEmailCampaignForm from '@/components/forms/create-email-campaign'

type Props = {
    subaccountId: string
}

const CreateEmailButton = ({ subaccountId }: Props) => {
    const { setOpen } = useModal()

    const handleCreate = () => {
        setOpen(
            <CustomModal
                title="Create Email Campaign"
                subheading="Set up your campaign details before designing."
            >
                <CreateEmailCampaignForm subaccountId={subaccountId} />
            </CustomModal>
        )
    }

    return (
        <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Email
        </Button>
    )
}

export default CreateEmailButton
