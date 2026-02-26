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
  const [uploadName, setUploadName] = useState('');
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
    setUploadName('');
    setShowForm(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        url: String(reader.result || ''),
      }));
    };
    reader.readAsDataURL(file);
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
        <form onSubmit={addImage} className="rounded-xl border border-primary-100 p-4 grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {tr('Fichier image (PC ou telephone)', 'Image file (computer or phone)')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-white"
            />
            {uploadName && <p className="mt-1 text-xs text-gray-500">{uploadName}</p>}
          </div>
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
          {form.url && (
            <div className="md:col-span-2 rounded-lg border border-dashed border-gray-300 p-2 bg-gray-50">
              <Image src={form.url} alt={form.title || 'Preview'} width={1280} height={480} className="h-40 w-full object-contain rounded-md bg-gray-100" />
            </div>
          )}
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
          <div key={image.id} className={`rounded-xl border p-3 ${image.active ? 'border-primary-100 bg-white' : 'border-slate-200 bg-slate-50'}`}>
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
                  type="button"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                    image.active ? 'bg-slate-700 text-white' : 'bg-primary-700 text-white'
                  }`}
                  onClick={() => toggleImage(image.id)}
                >
                  {image.active ? tr('Desactiver', 'Disable') : tr('Activer', 'Activate')}
                </button>
                <button
                  type="button"
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
