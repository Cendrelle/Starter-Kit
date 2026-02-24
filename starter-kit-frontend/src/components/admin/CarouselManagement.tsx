import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CarouselImage } from '@/utils/types';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface CarouselManagementProps {
  images: CarouselImage[];
  onChange: (images: CarouselImage[]) => void;
}

export const CarouselManagement: React.FC<CarouselManagementProps> = ({ images, onChange }) => {
  const { tr } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    url: '',
    title: '',
    description: '',
    link: '/donation',
  });

  const addImage = (event: React.FormEvent) => {
    event.preventDefault();
    const next: CarouselImage = {
      id: `carousel-${Date.now()}`,
      url: form.url,
      title: form.title,
      description: form.description,
      link: form.link,
      order: images.length + 1,
      active: true,
    };
    onChange([...images, next]);
    setForm({ url: '', title: '', description: '', link: '/donation' });
    setShowForm(false);
  };

  const toggleImage = (id: string) => {
    onChange(images.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
  };

  const removeImage = (id: string) => {
    onChange(images.filter((item) => item.id !== id).map((item, index) => ({ ...item, order: index + 1 })));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Carrousel accueil</h2>
          <p className="text-sm text-gray-600">{tr('Toute image active apparait sur la page d accueil.', 'Any active image appears on the home page carousel.')}</p>
        </div>
        <Button size="sm" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? tr('Fermer', 'Close') : tr('Ajouter une image', 'Add image')}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={addImage} className="rounded-xl border border-gray-200 p-4 grid md:grid-cols-2 gap-3">
          <Input
            label={tr('URL image', 'Image URL')}
            value={form.url}
            onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="/images/carousel/custom.jpg"
            required
          />
          <Input
            label={tr('Lien de destination', 'Destination link')}
            value={form.link}
            onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
            placeholder="/donation"
          />
          <Input
            label={tr('Titre', 'Title')}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <Input
            label={tr('Description', 'Description')}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="sm">
              {tr('Ajouter', 'Add')}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {images.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            {tr('Aucune image dans le carrousel.', 'No image in carousel.')}
          </div>
        )}
        {images.map((image) => (
          <div key={image.id} className={`rounded-xl border p-3 ${image.active ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <Image
                src={image.url}
                alt={image.title}
                width={320}
                height={96}
                className="h-24 w-full md:w-44 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{image.title}</p>
                <p className="text-sm text-gray-600">{image.description}</p>
                <p className="text-xs text-primary-700 mt-1">{image.link}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                    image.active ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                  }`}
                  onClick={() => toggleImage(image.id)}
                >
                  {image.active ? tr('Desactiver', 'Disable') : tr('Activer', 'Activate')}
                </button>
                <button
                  className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-semibold"
                  onClick={() => removeImage(image.id)}
                >
                  {tr('Supprimer', 'Delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
