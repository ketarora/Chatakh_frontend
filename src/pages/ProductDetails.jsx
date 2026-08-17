import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { getImageUrl, getProductImage } from "../utils/images";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const contentRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImageIndex(0);
    setAdded(false);
    setImageLoaded(false);
    
    api.get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        return api.get(`/api/products?limit=4`);
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        setRelatedProducts(data.filter(p => p._id !== id).slice(0, 4));
      })
      .catch(err => console.error("Error:", err));
  }, [id]);

  useEffect(() => {
    if (product && contentRef.current) {
      gsap.from(contentRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen" style={{ background: '#FAF7F2' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#0F1621] border-t-transparent" />
        <p className="mt-4 text-[#8A8279] text-sm tracking-widest uppercase">Loading product...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, size, qty: quantity });
    setAdded(true);
    setTimeout(() => navigate("/cart"), 1200);
  };

  const images = product.images && product.images.length > 0 ? product.images : [];
  const mainImage = images.length > 0 ? getImageUrl(images[selectedImageIndex]) : getProductImage(product);
  const fallbackImage = getProductImage(product);

  const tabs = [
    { key: "details", label: "Details" },
    { key: "materials", label: "Materials" },
    { key: "sizing", label: "Size & Fit" },
    { key: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: '#8A8279' }}>
          <Link to="/" className="hover:text-[#0F1621] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-[#0F1621] transition-colors">Collections</Link>
          <span>/</span>
          <span className="font-medium capitalize" style={{ color: '#0F1621' }}>{product.category || 'Product'}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          {/* LEFT: Thumbnail Gallery (Desktop) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-3 pt-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:opacity-100"
                style={{
                  borderColor: selectedImageIndex === index ? '#0F1621' : 'transparent',
                  opacity: selectedImageIndex === index ? 1 : 0.6,
                }}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
              </button>
            ))}
          </div>

          {/* CENTER: Main Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-xl lg:rounded-2xl overflow-hidden" style={{ background: '#F5F0EB', aspectRatio: '3/4' }}>
              {/* New Arrival Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm" style={{ background: '#FAF7F2', color: '#0F1621' }}>
                  New Arrival
                </span>
              </div>

              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700"
                style={{ opacity: imageLoaded ? 1 : 0 }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => { e.target.src = fallbackImage; setImageLoaded(true); }}
              />

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md z-10"
                  >
                    <svg className="w-4 h-4" style={{ color: '#0F1621' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md z-10"
                  >
                    <svg className="w-4 h-4" style={{ color: '#0F1621' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Zoom */}
              <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md z-10">
                <svg className="w-4 h-4" style={{ color: '#0F1621' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>

            {/* Mobile Thumbnails */}
            <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300"
                  style={{
                    borderColor: selectedImageIndex === index ? '#0F1621' : 'transparent',
                    opacity: selectedImageIndex === index ? 1 : 0.5,
                  }}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = fallbackImage; }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Category */}
            <span className="inline-block self-start px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-sm mb-4" style={{ background: '#F5F0EB', color: '#0F1621' }}>
              {product.category || 'Fashion'}
            </span>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-3 leading-tight" style={{ color: '#0F1621', fontFamily: "'Playfair Display', 'Georgia', serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span style={{ color: '#8A8279' }} className="text-sm">4.8 (128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl lg:text-4xl font-bold" style={{ color: '#0F1621' }}>₹{product.price}</span>
              <span className="text-lg line-through" style={{ color: '#8A8279' }}>₹{Math.round(product.price * 1.5)}</span>
              <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded">33% OFF</span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#8A8279' }}>
              {product.description || 'Premium quality product crafted with attention to detail for ultimate comfort and modern style.'}
            </p>

            <div className="h-px mb-6" style={{ background: '#F5F0EB' }} />

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold" style={{ color: '#0F1621' }}>
                  Size: <span className="font-normal" style={{ color: '#8A8279' }}>{size}</span>
                </label>
                <button className="text-xs font-medium underline underline-offset-2 flex items-center gap-1" style={{ color: '#0F1621' }}>
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2.5">
                {["S", "M", "L", "XL", "XXL"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="w-12 h-12 rounded-lg font-medium text-sm transition-all duration-300"
                    style={{
                      background: size === s ? '#0F1621' : 'transparent',
                      color: size === s ? '#FAF7F2' : '#0F1621',
                      border: size === s ? 'none' : '1px solid #F5F0EB',
                      boxShadow: size === s ? '0 4px 12px rgba(15,22,33,0.2)' : 'none',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-sm font-semibold mb-3 block" style={{ color: '#0F1621' }}>Quantity</label>
              <div className="inline-flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid #F5F0EB' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-lg transition-colors hover:bg-[#F5F0EB]"
                  style={{ color: '#0F1621' }}
                >−</button>
                <span className="w-14 h-11 flex items-center justify-center font-semibold" style={{ color: '#0F1621', borderLeft: '1px solid #F5F0EB', borderRight: '1px solid #F5F0EB' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-lg transition-colors hover:bg-[#F5F0EB]"
                  style={{ color: '#0F1621' }}
                >+</button>
              </div>
            </div>

            {/* Add to Cart + Wishlist */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 active:scale-[0.98]"
                style={{
                  background: added ? '#16a34a' : '#0F1621',
                  color: '#FAF7F2',
                }}
              >
                {added ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  border: isWishlisted ? '1px solid #fca5a5' : '1px solid #F5F0EB',
                  background: isWishlisted ? '#fef2f2' : 'transparent',
                  color: isWishlisted ? '#ef4444' : '#0F1621',
                }}
              >
                <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 py-4" style={{ borderTop: '1px solid #F5F0EB' }}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" style={{ color: '#0F1621' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#0F1621' }}>Free Shipping</p>
                  <p className="text-[10px]" style={{ color: '#8A8279' }}>On orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" style={{ color: '#0F1621' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#0F1621' }}>Easy Returns</p>
                  <p className="text-[10px]" style={{ color: '#8A8279' }}>30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" style={{ color: '#0F1621' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#0F1621' }}>Secure Payment</p>
                  <p className="text-[10px]" style={{ color: '#8A8279' }}>100% secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="flex mb-6" style={{ borderBottom: '1px solid #F5F0EB' }}>
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-4 sm:px-6 py-3 text-sm font-medium transition-all duration-300 relative"
                  style={{ color: activeTab === tab.key ? '#0F1621' : '#8A8279' }}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: '#0F1621' }} />
                  )}
                </button>
              ))}
            </div>

            <div className="text-sm leading-relaxed" style={{ color: '#8A8279' }}>
              {activeTab === "details" && (
                <div>
                  <p className="mb-4">{product.description || 'Crafted with premium materials, this piece delivers unmatched comfort and durability.'}</p>
                  <ul className="space-y-3">
                    {['Premium quality fabric', 'Comfortable fit for everyday wear', 'Modern design with heritage craftsmanship', 'Unisex style'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg className="w-4 h-4 shrink-0" style={{ color: '#0F1621' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "materials" && (
                <div>
                  <p className="mb-3">We use only the finest materials sourced responsibly:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Premium cotton blend (80% cotton, 20% polyester)</li>
                    <li>Reinforced stitching for durability</li>
                    <li>Eco-friendly dyes — gentle on skin and the planet</li>
                    <li>Pre-washed to minimize shrinkage</li>
                  </ul>
                </div>
              )}
              {activeTab === "sizing" && (
                <div>
                  <p className="mb-3">Our garments are designed with a modern fit:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs rounded-lg overflow-hidden" style={{ border: '1px solid #F5F0EB' }}>
                      <thead>
                        <tr style={{ background: '#F5F0EB' }}>
                          <th className="px-4 py-2.5 font-semibold" style={{ color: '#0F1621' }}>Size</th>
                          <th className="px-4 py-2.5 font-semibold" style={{ color: '#0F1621' }}>Chest</th>
                          <th className="px-4 py-2.5 font-semibold" style={{ color: '#0F1621' }}>Length</th>
                          <th className="px-4 py-2.5 font-semibold" style={{ color: '#0F1621' }}>Shoulder</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[['S','36','26','16'],['M','38','27','17'],['L','40','28','18'],['XL','42','29','19'],['XXL','44','30','20']].map(([s,c,l,sh]) => (
                          <tr key={s} style={{ borderTop: '1px solid #F5F0EB' }}>
                            <td className="px-4 py-2">{s}</td><td className="px-4 py-2">{c}"</td><td className="px-4 py-2">{l}"</td><td className="px-4 py-2">{sh}"</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: '#0F1621' }}>Shipping</h4>
                    <p>Free shipping on all orders above ₹999. Standard delivery takes 5-7 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: '#0F1621' }}>Returns</h4>
                    <p>Easy returns within 30 days of delivery. Items must be unworn with original tags attached.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detail Image */}
          <div className="rounded-xl lg:rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-auto" style={{ background: '#F5F0EB' }}>
            <img
              src={images.length > 1 ? getImageUrl(images[1]) : mainImage}
              alt={`${product.name} detail`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif" style={{ color: '#0F1621', fontFamily: "'Playfair Display', 'Georgia', serif" }}>
              You May Also Like
            </h2>
            <Link to="/collections" className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-70" style={{ color: '#0F1621' }}>
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((item) => (
              <Link key={item._id} to={`/product/${item._id}`} className="group">
                <div className="relative rounded-xl overflow-hidden mb-3" style={{ background: '#F5F0EB', aspectRatio: '3/4' }}>
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => { e.target.src = fallbackImage; }}
                  />
                  <button 
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg className="w-4 h-4" style={{ color: '#0F1621' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-sm font-medium group-hover:opacity-70 transition-colors" style={{ color: '#0F1621' }}>{item.name}</h3>
                <p className="text-sm font-bold mt-0.5" style={{ color: '#0F1621' }}>₹{item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
