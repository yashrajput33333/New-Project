import React from "react";
import { Link } from "react-router-dom";

function PostCard({ slug, title, featuredImage }) {
  return (
    <Link to={`/post/${slug}`} className="group">
      <div className="w-full bg-white rounded-xl overflow-hidden shadow-lg transition-all transform hover:scale-[1.03] hover:shadow-2xl duration-300">
        {/* Image */}
        {featuredImage && (
          <div className="relative">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
