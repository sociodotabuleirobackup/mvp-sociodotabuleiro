import React from 'react';
import { Asset } from '@socio-do-tabuleiro/shared';

const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    title: 'Pacote Mapas: Tumba Antiga',
    type: 'MAP',
    price: 15.9,
    author: 'Cartógrafo Real',
    imageUrl: 'https://picsum.photos/seed/map1/300/300',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Aventura: Oculto nas Sombras',
    type: 'MODULE',
    price: 29.9,
    author: 'Guilda dos Narradores',
    imageUrl: 'https://picsum.photos/seed/book1/300/300',
    rating: 5.0,
  },
  {
    id: '3',
    title: 'Tokens: Monstros Marinhos',
    type: 'TOKEN',
    price: 12.0,
    author: 'Artificer Joe',
    imageUrl: 'https://picsum.photos/seed/token1/300/300',
    rating: 4.5,
  },
];

export const Marketplace: React.FC = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Mercado de Aventuras
          </h1>
          <p className="text-gray-400">
            Encontre mapas, aventuras prontas e tokens para sua mesa.
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <FilterChip label="Todos" active />
          <FilterChip label="Mapas" />
          <FilterChip label="Aventuras (PDF)" />
          <FilterChip label="Tokens" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_ASSETS.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

const FilterChip: React.FC<{ label: string; active?: boolean }> = ({
  label,
  active,
}) => (
  <button
    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${active ? 'bg-primary text-white' : 'bg-surface border border-border text-gray-400 hover:border-primary hover:text-white'}`}
  >
    {label}
  </button>
);

const AssetCard: React.FC<{ asset: Asset }> = ({ asset }) => (
  <div className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:border-primary/50 transition-all">
    <div
      className="aspect-square bg-cover bg-center relative"
      style={{ backgroundImage: `url('${asset.imageUrl}')` }}
    >
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
        <span className="material-symbols-outlined text-[10px] text-accent">
          star
        </span>{' '}
        {asset.rating}
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
          Ver Detalhes
        </button>
      </div>
    </div>
    <div className="p-3">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
          {asset.type}
        </span>
        <span className="text-sm font-bold text-green-400">
          R$ {asset.price.toFixed(2)}
        </span>
      </div>
      <h3 className="font-bold text-white leading-tight mb-2 line-clamp-2">
        {asset.title}
      </h3>
      <p className="text-xs text-gray-500">por {asset.author}</p>
    </div>
  </div>
);
