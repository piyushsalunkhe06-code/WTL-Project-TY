import React from 'react';

/**
 * CategoryFilter Component
 * Category selector buttons demonstrating event handling, props callbacks,
 * and active visual styling without full-page reloads.
 * 
 * @param {Object} props
 * @param {string[]} props.categories - List of category strings
 * @param {string} props.selectedCategory - Currently selected category
 * @param {function} props.onSelectCategory - Callback when user clicks a category
 * @param {Object} props.categoryCounts - Map of category to number of posts
 */
export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) {
  const categoryIcons = {
    All: '🌐',
    Technical: '💻',
    Achievements: '🏆',
    Events: '📅',
    General: '💬'
  };

  return (
    <nav className="category-filter-nav" aria-label="Post Category Filter">
      <div className="filter-pill-container" role="tablist">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] ?? 0;

          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`filter-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              <span className="pill-icon" aria-hidden="true">{categoryIcons[cat] || '🏷️'}</span>
              <span className="pill-text">{cat}</span>
              <span className="pill-count">{count}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
