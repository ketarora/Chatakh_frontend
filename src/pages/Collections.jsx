import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const mainCollections = [
  {
    value: "threads-of-aura",
    name: "The Threads of Aura",
    image:
      "/threads%20of%20aura.png",
  },
  {
    value: "colors-of-aura",
    name: "The Colors of Aura",
    image:
      "/colors%20of%20aura.png",
  },
];

const Collections = () => {
  const { mainCollection } = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const hasSelectedCollection = Boolean(mainCollection);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(
    ["men", "women", "couple"].includes(categoryParam) ? categoryParam : "men"
  );
  const [loading, setLoading] = useState(false);

  const selectedCollection = mainCollections.find((collection) => collection.value === mainCollection);

  useEffect(() => {
    if (!hasSelectedCollection || !selectedCollection) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = `/api/products?mainCollection=${selectedCollection.value}&category=${category}`;

        const res = await api.get(url);
        // Seamless backend proxy connection bypass array destructuring
        const fetchedData = res.data?.products || res.data || [];
        setProducts(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (err) {
        console.error("COLLECTION FETCH ERROR:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [hasSelectedCollection, selectedCollection, category]);

  const categoryOptions = [
    { value: "men", label: "Man" },
    { value: "women", label: "Woman" },
    { value: "couple", label: "Couple" },
  ];

  return (
    <div 
      className="w-full text-[#3f2a24] font-sans"
      style={{ backgroundColor: '#fffaf6', minHeight: '100vh', marginTop: '80px', paddingBottom: '80px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 w-full">
        {/* HEADER BANNER - Perfectly encapsulated in centered container */}
        <div 
          className="relative overflow-hidden text-[#fff6e9] pt-16 pb-12 px-6 w-full rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
          style={{ 
            background: 'linear-gradient(135deg, #1d1d1d 0%, #4b1930 50%, #ec0080 100%)' 
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_35%)]"></div>
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#ffe8f4] backdrop-blur-sm mb-6">
              Modern Fashion Edit
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-4 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              {selectedCollection ? selectedCollection.name : "Collections"}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl text-center leading-relaxed font-light drop-shadow-sm">
              A refined selection of pristine outfits designed for effortless confidence, statement styling, and everyday luxury.
            </p>
          </div>
        </div>
        
        {/* CENTERED EDITORIAL TEXT */}
        <div className="mb-10 mt-14 max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#ec0080] mb-4">Signature Edit</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#2a1b16] leading-tight tracking-tight mb-6">
            Elevated essentials for the modern wardrobe.
          </h2>
          <div className="w-16 h-px bg-[#d2c5bb] mb-6"></div>
          <p className="text-sm sm:text-base md:text-lg text-[#5a4239] leading-relaxed font-light max-w-2xl">
            Discover beautifully curated pieces that blend premium textures, contemporary comfort, and expressive detailing into one sophisticated edit.
          </p>
        </div>

        {/* CONTROLS: Back + Filters */}
        <div className="w-full flex flex-col items-center justify-center gap-6 mb-16">
          
          {hasSelectedCollection && selectedCollection && (
            <Link
              to="/collections"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase border border-[#d2c5bb] text-[#3f2a24] bg-transparent hover:bg-[#3f2a24] hover:text-[#FAF7F2] transition-colors shadow-sm"
            >
              <span aria-hidden="true" className="text-sm leading-none -mt-0.5">←</span>
              Back to Collections
            </Link>
          )}

          {/* HIGH CONTRAST VISIBLE & UNIFORM GENDER BUTTONS */}
          {hasSelectedCollection && selectedCollection && (
            <div 
              className="inline-flex bg-[#fffdf8] p-1.5 rounded-full shadow-inner border border-[#d2c5bb] gap-1"
            >
              {categoryOptions.map((option) => {
                const isActive = category === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setCategory(option.value)}
                    className={`rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 w-24 sm:w-32 h-10 sm:h-12 flex items-center justify-center ${isActive ? "shadow-md" : "hover:bg-[#e8d5c4]/30"}`}
                    style={isActive ? { backgroundColor: '#1d1512', color: '#ffffff' } : { color: '#8a6b57' }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* PRODUCTS GRID */}
        {!hasSelectedCollection ? null : !selectedCollection ? null : loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full animate-pulse">
               <div className="h-80 bg-[#e8d5c4]/30 rounded-3xl w-full"></div>
               <div className="h-80 bg-[#e8d5c4]/30 rounded-3xl w-full hidden sm:block"></div>
               <div className="h-80 bg-[#e8d5c4]/30 rounded-3xl w-full hidden md:block"></div>
               <div className="h-80 bg-[#e8d5c4]/30 rounded-3xl w-full hidden lg:block"></div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[3rem] border border-[#f3c178]/60 bg-white shadow-xl px-4 py-20 text-center sm:px-6">
            <p className="text-xl sm:text-2xl text-[#2a1b16] font-bold font-serif">
              No pieces available in this section.
            </p>
            <p className="text-[#8a6b57] mt-3 text-sm tracking-wide">Check back soon for our newest drops.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
