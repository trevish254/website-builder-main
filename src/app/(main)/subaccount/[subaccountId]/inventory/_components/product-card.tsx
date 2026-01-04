'use client'
import React from 'react'
import { Product } from '@/lib/database.types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

import Link from 'next/link'

interface ProductCardProps {
    product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Link href={`/subaccount/${product.subAccountId}/inventory/${product.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer">
                <CardHeader className="p-0 relative aspect-square bg-muted/20">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                            No Image
                        </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-sm truncate pr-2" title={product.name}>{product.name}</h3>
                            <p className="text-[10px] text-muted-foreground">{product.brand || 'No Brand'}</p>
                        </div>
                        <div className="flex items-center text-yellow-500 text-[10px] gap-0.5">
                            <Star className="h-3 w-3 fill-current" />
                            <span>4.5</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-sm">KES {Number(product.price).toLocaleString()}</span>

                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default ProductCard
