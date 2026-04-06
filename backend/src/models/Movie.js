import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  posterUrl: { type: String, required: true },
  bannerUrl: { type: String },
  trailerUrl: { type: String },
  director: { type: String, default: "Đang cập nhật" },
  cast: { type: [String], default: [] }, 
 
  language: { type: String, default: "vietnamese" }, 
  genre: { type: [String], default: [] }, 
  rating: { type: Number, default: 0 }, 
  duration: { type: Number, default: 0 }, 
  releaseDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['showing', 'coming', 'ended'], 
    default: 'showing' 
  }
}, { 
  timestamps: true,
  languageKey: '_unused_language_key' 
});
movieSchema.index(
  { title: 'text', description: 'text' }, 
  { language_override: 'none', name: 'MovieTextIndex' } 
);


const Movie = mongoose.model('Movie', movieSchema);
export default Movie;