import { Link } from "react-router-dom";
import { Play, Star, Ticket } from "lucide-react";
import { motion } from "framer-motion";

export default function MovieCard({ movie }) {
  if (!movie) return null;

  return (
    <motion.div
      whileHover={{ y: -8, x: -4 }}
      className="group relative bg-white border-4 border-gray-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(220,38,38,1)] transition-all duration-300"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden border-b-4 border-gray-900">
        <img
          src={movie.posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-yellow-400 border-2 border-gray-900 px-2 py-1 flex items-center gap-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Star size={12} className="fill-black text-black" />
          <span className="text-[10px] font-black">
            {movie.rating || "N/A"}
          </span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link
            to={`/movie/${movie._id}`}
            className="bg-gray-900 text-white p-4 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            <Play fill="currentColor" size={24} />
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 bg-white">
        <h3 className="font-black text-sm uppercase italic tracking-tighter truncate group-hover:text-red-600 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
            {Array.isArray(movie.genre) ? movie.genre[0] : "Movie"}
          </p>
          <span className="text-[8px] border-2 border-gray-900 px-1.5 py-0.5 font-black uppercase bg-gray-100">
            Digital 2D
          </span>
        </div>
      </div>
    </motion.div>
  );
}
