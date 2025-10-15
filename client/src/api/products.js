export async function fetchProducts() {
  const response = await fetch('http://localhost:5001/api/products');
    return await response.json();
}