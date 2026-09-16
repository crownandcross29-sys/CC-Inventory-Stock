import { NextResponse } from 'next/server';
const { getProductsData, saveProductsData, createSlug } = require('../../../lib/generateJson');

export async function GET() {
  try {
    const data = getProductsData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const data = getProductsData();

    // If full data replacement or sync
    if (payload.fullSync && payload.data) {
      saveProductsData(payload.data);
      return NextResponse.json({ success: true, message: 'All products synced successfully', data: payload.data });
    }

    // Otherwise add new product
    const product = payload.product;
    if (!product || !product.name || !product.price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const newId = product.id || `cc-${String(Date.now()).slice(-6)}`;
    const newSlug = product.slug || createSlug(product.name);

    const newProduct = {
      id: newId,
      slug: newSlug,
      name: product.name,
      category: product.category || 'Club',
      subCategory: product.subCategory || 'Fan Version Set',
      team: product.team || '',
      season: product.season || '2023/24',
      price: Number(product.price) || 0,
      mrp: Number(product.mrp) || Number(product.price) * 1.5,
      inStock: product.inStock !== false,
      stockStatus: product.stockStatus || (product.inStock ? 'In Stock' : 'Out of Stock'),
      stockQuantity: Number(product.stockQuantity) || 10,
      sizes: Array.isArray(product.sizes) ? product.sizes : ['S', 'M', 'L', 'XL'],
      images: Array.isArray(product.images) && product.images.length > 0 
        ? product.images 
        : ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80'],
      featured: Boolean(product.featured),
      isBestSeller: Boolean(product.isBestSeller),
      isRetro: product.category === 'Retro',
      description: product.description || ''
    };

    data.products.unshift(newProduct);
    saveProductsData(data);

    return NextResponse.json({ success: true, message: 'Product added successfully', product: newProduct, total: data.products.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const payload = await request.json();
    const { id, updates } = payload;
    if (!id || !updates) {
      return NextResponse.json({ error: 'Product ID and updates are required' }, { status: 400 });
    }

    const data = getProductsData();
    const index = data.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    data.products[index] = {
      ...data.products[index],
      ...updates,
      price: updates.price ? Number(updates.price) : data.products[index].price,
      mrp: updates.mrp ? Number(updates.mrp) : data.products[index].mrp,
      stockQuantity: updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : data.products[index].stockQuantity
    };

    saveProductsData(data);
    return NextResponse.json({ success: true, message: 'Product updated', product: data.products[index] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const data = getProductsData();
    const initialCount = data.products.length;
    data.products = data.products.filter((p) => p.id !== id);

    if (data.products.length === initialCount) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    saveProductsData(data);
    return NextResponse.json({ success: true, message: 'Product deleted', remaining: data.products.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const payload = await request.json();
    const { id, stockStatus, inStock, stockQuantity } = payload;
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const data = getProductsData();
    const product = data.products.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (stockStatus !== undefined) product.stockStatus = stockStatus;
    if (inStock !== undefined) product.inStock = inStock;
    if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);

    saveProductsData(data);
    return NextResponse.json({ success: true, message: 'Stock status updated', product });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
