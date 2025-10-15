import ProductGrid from '../components/ProductGrid';
import ProductControlBar from '../components/ProductControlBar';
import { useState } from 'react';

function HomePage() {
  const [sortOption, setSortOption] = useState('latest');

  return (
    <div className="homepage-container">
      <ProductControlBar
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      <ProductGrid sortOption={sortOption} />
    </div>
  );
}

export default HomePage;