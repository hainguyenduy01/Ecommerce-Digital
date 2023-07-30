import React, { useEffect, useState } from 'react';
import { apiGetProducts } from '../apis/product';
import Slider from 'react-slick';
import Product from './Product';

const tabs = [
	{ id: 1, name: 'Best Seller' },
	{ id: 2, name: 'New Arrivals' },
];
const settings = {
	dots: false,
	infinite: false,
	speed: 500,
	slidesToShow: 3,
	slidesToScroll: 1,
};
const BestSeller = () => {
	const [bestSellers, setBestSellers] = useState(null);
	const [newProducts, setNewProducts] = useState(null);
	const [activeTab, setActiveTab] = useState(1);
	const fetchProducts = async () => {
		const response = await Promise.all([
			apiGetProducts({ sort: '-sold' }),
			apiGetProducts({ sort: '-createdAt' }),
		]);
		if (response[0]?.success) setBestSellers(response[0].products);
		if (response[1]?.success) setNewProducts(response[1].products);
	};
	useEffect(() => {
		fetchProducts();
	}, []);
	return (
		<div>
			<div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main ">
				{tabs.map((el) => (
					<span
						key={el.id}
						className={`font-semibold capitalize border-r cursor-pointer text-gray-400 ${
							activeTab === el.id ? 'text-gray-900' : ''
						}`}
						onClick={() => setActiveTab(el.id)}
					>
						{el.name}
					</span>
				))}
			</div>
			<div className="mt-4">
				<Slider {...settings}>
					{bestSellers?.map((el) => (
						<Product key={el.id} productData={el} />
					))}
				</Slider>
			</div>
		</div>
	);
};

export default BestSeller;
