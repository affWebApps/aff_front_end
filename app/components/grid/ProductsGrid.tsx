import { motion } from "framer-motion";
import Image from "next/image";

interface Product {
  id: string | number;
  image: string;
  title: string;
  price: string | number;
  seller: string;
}

interface ProductsGridProps {
  products: Product[];
}

export const ProductsGrid = ({ products }: ProductsGridProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div className="aspect-square overflow-hidden relative">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              {product.title}
            </h3>
            <p className="text-lg font-bold text-gray-900 mb-2">
              ₦ {product.price}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">{product.seller}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
