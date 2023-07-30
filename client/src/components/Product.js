import React from 'react';
import { formatMoney } from '../utils/helpers';
import label from '../assets/label.png';
import labelBlue from '../assets/label-blue.png';
const Product = ({ productData, isNew }) => {
	return (
		<div className="w-full text-base px-[10px]">
			<div className="w-full border p-[15px] flex flex-col items-center">
				<div className="w-full relative">
					<img
						src={
							productData?.thumb ||
							'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'
						}
						alt=""
						className="w-[243px] h-[243px] object-cover"
					/>
					<img
						src={isNew ? label : labelBlue}
						alt=""
						className={`absolute top-[-32px] left-[-42px] w-[120px] object-contain  `}
					/>
					<span
						className={`font-bold top-[-10px] left-[-12px] text-white absolute ${
							isNew ? '' : 'text-sm'
						}`}
					>
						{isNew ? 'New' : 'Trending'}
					</span>
				</div>
				<div className="flex flex-col gap-1 mt-[15px] w-full items-start">
					<span className="line-clamp-1">{productData?.title}</span>
					<span>{`${formatMoney(productData?.price)} VNĐ`}</span>
				</div>
			</div>
		</div>
	);
};
export default Product;
