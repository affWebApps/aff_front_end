import { motion } from "framer-motion";
import Image from "next/image";

interface Product {
  id: number;
  image: string;
  title: string;
  price: string | number;
  seller: string;
}

interface ProductsGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const ProductsGrid = ({
  products,
  onProductClick,
}: ProductsGridProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={fadeInUp}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
          onClick={() => onProductClick(product)}
        >
          <div className="aspect-square bg-gray-200 relative overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.title}
            </h3>
            <div className="text-lg font-bold text-gray-900 mb-2">
              ₦ {product.price}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-600">{product.seller}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
