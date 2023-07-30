import React from 'react';
import { renderStarFromNumber, formatMoney } from '../utils/helpers';
const ProductCard = ({ price, totalRating, title, image }) => {
	return (
		<div className="w-1/3 flex-auto px-[10px] mb-[20px]">
			<div className="w-full flex border">
				<img
					src={image}
					alt="products"
					className="w-[120px] object-contain p-4"
				/>
				<div className="flex flex-col gap-1 mt-[15px] w-full items-start text-xs">
					<span className="line-clamp-1 capitalize text-sm">
						{title?.toLowerCase()}
					</span>
					<span className="flex h-4">
						{renderStarFromNumber(totalRating, 14)}
					</span>
					<span>{`${formatMoney(price)} VNĐ`}</span>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
