'use client'
import ProductForm from '@/components/forms/product-form'
import CustomModal from '@/components/global/custom-modal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import { Plus } from 'lucide-react'
import React from 'react'

type Props = {
    subaccountId: string
}

const CreateProductButton = ({ subaccountId }: Props) => {
    const { setOpen } = useModal()

    const handleCreateProduct = () => {
        setOpen(
            <CustomModal
                title="Add Product or Service"
                subheading="Manage your inventory and sync with Paystack."
                className="max-w-4xl"
            >
                <ProductForm subAccountId={subaccountId} />
            </CustomModal>
        )
    }

    return (
        <Button onClick={handleCreateProduct}>
            <Plus size={15} className="mr-2" />
            Create Product
        </Button>
    )
}

export default CreateProductButton
