import React, { useState } from 'react';
import { formatMoney } from '../utils/helpers';
import label from '../assets/new.png';
import trending from '../assets/trending.png';
import { renderStarFromNumber } from '../utils/helpers';
import SelectOption from './SelectOption';
import icons from '../utils/icons';
import { Link } from 'react-router-dom';
import path from '../utils/path';
const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons;

const Product = ({ productData, isNew }) => {
	const [isShowOption, setIsShowOption] = useState(false);
	return (
		<div className="w-full text-base px-[10px]">
			<Link
				to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}}`}
				className="w-full border p-[15px] flex flex-col items-center"
				onMouseEnter={(e) => {
					e.stopPropagation();
					setIsShowOption(true);
				}}
				onMouseLeave={(e) => {
					e.stopPropagation();
					setIsShowOption(false);
				}}
			>
				<div className="w-full relative">
					{isShowOption && (
						<div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
							<SelectOption icon={<BsFillSuitHeartFill />} />
							<SelectOption icon={<AiOutlineMenu />} />
							<SelectOption icon={<AiFillEye />} />
						</div>
					)}
					<img
						src={
							productData?.thumb ||
							'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'
						}
						alt=""
						className="w-[274px] h-[274px] object-cover"
					/>
					<img
						src={isNew ? label : trending}
						alt=""
						className={`absolute w-[100px] h-[35px] top-[0] right-[0] object-contain`}
					/>
				</div>
				<div className="flex flex-col gap-1 mt-[15px] w-full items-start">
					<span className="flex h-4">
						{renderStarFromNumber(productData?.totalRating)?.map(
							(el, index) => (
								<span key={index}>{el}</span>
							),
						)}
					</span>
					<span className="line-clamp-1">{productData?.title}</span>
					<span>{`${formatMoney(productData?.price)} VNĐ`}</span>
				</div>
			</Link>
		</div>
	);
};
export default Product;
