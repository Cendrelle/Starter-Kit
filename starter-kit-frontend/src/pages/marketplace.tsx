import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { mapBackendMarketplaceItem } from '@/lib/mappers';
import { MarketplaceCategory, MarketplaceItem } from '@/utils/types';

type CategoryOption = {
  id: MarketplaceCategory;
  label: string;
  short: string;
};

const CATEGORY_STYLE: Record<MarketplaceCategory, { badge: string; accent: string }> = {
  cv_template: { badge: 'bg-amber-100 text-amber-700', accent: 'from-amber-200 via-amber-100 to-white' },
  portfolio: { badge: 'bg-sky-100 text-sky-700', accent: 'from-sky-200 via-sky-100 to-white' },
  ebook: { badge: 'bg-emerald-100 text-emerald-700', accent: 'from-emerald-200 via-emerald-100 to-white' },
  revision_sheet: { badge: 'bg-rose-100 text-rose-700', accent: 'from-rose-200 via-rose-100 to-white' },
  notion_template: { badge: 'bg-stone-100 text-stone-700', accent: 'from-stone-200 via-stone-100 to-white' },
  excel_template: { badge: 'bg-lime-100 text-lime-700', accent: 'from-lime-200 via-lime-100 to-white' },
  ui_kit: { badge: 'bg-indigo-100 text-indigo-700', accent: 'from-indigo-200 via-indigo-100 to-white' },
};

const formatPrice = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  }
};

const getFallbackItems = (tr: (fr: string, en: string) => string): MarketplaceItem[] => [
  {
    id: 'demo-cv-1',
    title: tr('Templates CV "ATS Ready"', 'ATS-ready CV templates'),
    description: tr('10 variantes modernes pour candidatures locales et internationales.', '10 modern variants for local and international applications.'),
    category: 'cv_template',
    price: 2500,
    currency: 'XOF',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'demo-portfolio-1',
    title: tr('Portfolio Web pour freelances', 'Freelance web portfolio'),
    description: tr('Structure multi-projets avec sections services et cas d etude.', 'Multi-project structure with services and case studies.'),
    category: 'portfolio',
    price: 4000,
    currency: 'XOF',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'demo-ebook-1',
    title: tr('Ebooks de cours Data & IA', 'Data & AI course ebooks'),
    description: tr('Pack de 6 ebooks avec exercices corriges.', 'Pack of 6 ebooks with corrected exercises.'),
    category: 'ebook',
    price: 3500,
    currency: 'XOF',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'demo-revision-1',
    title: tr('Fiches de revision reseaux', 'Networking revision sheets'),
    description: tr('Synthese rapide pour examens et certifications.', 'Quick summaries for exams and certifications.'),
    category: 'revision_sheet',
    price: 1500,
    currency: 'XOF',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'demo-notion-1',
    title: tr('Templates Notion "Study Flow"', 'Study Flow Notion templates'),
    description: tr('Planification semestrielle, deadlines, objectifs et suivi.', 'Semester planning, deadlines, goals, and tracking.'),
    category: 'notion_template',
    price: 2000,
    currency: 'XOF',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'demo-excel-1',
    title: tr('Templates Excel Budget & Stage', 'Excel templates for budget & internships'),
    description: tr('Suivi de budget, candidatures, et planning de stage.', 'Budget tracking, internship applications, and planning.'),
    category: 'excel_template',
    price: 1800,
    currency: 'XOF',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'demo-ui-1',
    title: tr('UI Kit pour apps etudiants', 'UI kit for student apps'),
    description: tr('Composants Figma + variantes mobile et desktop.', 'Figma components with mobile and desktop variants.'),
    category: 'ui_kit',
    price: 5000,
    currency: 'XOF',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
];

const mapCategoryToBackend = (category: MarketplaceCategory) => {
  switch (category) {
    case 'cv_template':
      return 'CV_TEMPLATE';
    case 'portfolio':
      return 'PORTFOLIO';
    case 'ebook':
      return 'EBOOK';
    case 'revision_sheet':
      return 'FICHE_REVISION';
    case 'notion_template':
      return 'NOTION_TEMPLATE';
    case 'excel_template':
      return 'EXCEL_TEMPLATE';
    case 'ui_kit':
      return 'UI_KIT';
    default:
      return 'CV_TEMPLATE';
  }
};

export default function MarketplacePage() {
  const { tr } = useLanguage();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [itemsError, setItemsError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [purchaseStatus, setPurchaseStatus] = useState('');
  const [purchaseError, setPurchaseError] = useState('');
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');
  const [publishError, setPublishError] = useState('');
  const [publishForm, setPublishForm] = useState({
    title: '',
    description: '',
    category: 'cv_template' as MarketplaceCategory,
    price: '',
    currency: 'XOF',
    previewImageUrl: '',
    fileUrl: '',
  });
  const [publishAuthHint, setPublishAuthHint] = useState('');

  const categoryOptions = useMemo<CategoryOption[]>(() => [
    { id: 'cv_template', label: tr('CV templates', 'CV templates'), short: 'CV' },
    { id: 'portfolio', label: tr('Portfolios', 'Portfolios'), short: tr('Portfolio', 'Portfolio') },
    { id: 'ebook', label: tr('Ebooks de cours', 'Course ebooks'), short: tr('Ebooks', 'Ebooks') },
    { id: 'revision_sheet', label: tr('Fiches de revision', 'Revision sheets'), short: tr('Fiches', 'Sheets') },
    { id: 'notion_template', label: tr('Templates Notion', 'Notion templates'), short: 'Notion' },
    { id: 'excel_template', label: tr('Templates Excel', 'Excel templates'), short: 'Excel' },
    { id: 'ui_kit', label: tr('UI kits', 'UI kits'), short: 'UI' },
  ], [tr]);

  useEffect(() => {
    let isMounted = true;
    const fallback = getFallbackItems(tr);

    const fetchItems = async () => {
      try {
        setItemsError('');
        setIsLoading(true);
        const response = await api.get('/marketplace/items');
        if (!isMounted) return;
        const mapped = Array.isArray(response.data) ? response.data.map(mapBackendMarketplaceItem) : [];
        setItems(mapped.length > 0 ? mapped : fallback);
      } catch {
        if (!isMounted) return;
        setItemsError(tr('Impossible de charger le marketplace.', 'Could not load marketplace items.'));
        setItems(fallback);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [tr]);

  const filteredItems = useMemo(() => {
    const minValue = minPrice ? Number(minPrice) : null;
    const maxValue = maxPrice ? Number(maxPrice) : null;

    return items.filter((item) => {
      if (!item.isActive) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchTerm) {
        const raw = `${item.title} ${item.description}`.toLowerCase();
        if (!raw.includes(searchTerm.toLowerCase())) return false;
      }
      if (minValue !== null && Number.isFinite(minValue) && item.price < minValue) return false;
      if (maxValue !== null && Number.isFinite(maxValue) && item.price > maxValue) return false;
      return true;
    });
  }, [items, searchTerm, selectedCategory, minPrice, maxPrice]);

  const handlePublish = async (event: React.FormEvent) => {
    event.preventDefault();
    setPublishError('');
    setPublishStatus('');
    setPublishAuthHint('');

    const priceValue = Number(publishForm.price);
    if (!publishForm.title.trim() || !publishForm.description.trim()) {
      setPublishError(tr('Titre et description requis.', 'Title and description are required.'));
      return;
    }
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setPublishError(tr('Prix invalide.', 'Invalid price.'));
      return;
    }

    try {
      setIsPublishing(true);
      const response = await api.post('/marketplace/items', {
        title: publishForm.title.trim(),
        description: publishForm.description.trim(),
        category: mapCategoryToBackend(publishForm.category),
        price: priceValue,
        currency: publishForm.currency || 'XOF',
        previewImageUrl: publishForm.previewImageUrl || null,
        fileUrl: publishForm.fileUrl || null,
      });

      const created = response?.data;
      if (created) {
        setItems((prev) => [mapBackendMarketplaceItem(created), ...prev]);
      }

      setPublishStatus(tr('Ressource publiee.', 'Resource published.'));
      setPublishForm({
        title: '',
        description: '',
        category: 'cv_template',
        price: '',
        currency: 'XOF',
        previewImageUrl: '',
        fileUrl: '',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || '';
      if (message === 'No token provided' || error?.response?.status === 401) {
        setPublishAuthHint(tr('Connexion requise pour publier.', 'Login required to publish.'));
        return;
      }
      setPublishError(message || tr('Publication impossible.', 'Could not publish resource.'));
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePurchase = async (itemId: string) => {
    setPurchaseError('');
    setPurchaseStatus('');

    try {
      setIsPurchasing(itemId);
      await api.post(`/marketplace/items/${itemId}/purchase`, {
        buyerEmail: buyerEmail.trim().toLowerCase(),
      });
      setPurchaseStatus(tr('Demande d achat envoyee.', 'Purchase request sent.'));
      setBuyerEmail('');
    } catch (error: any) {
      setPurchaseError(error?.response?.data?.message || tr('Achat impossible.', 'Could not complete purchase.'));
    } finally {
      setIsPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.4), transparent 45%), radial-gradient(circle at 80% 0%, rgba(16,185,129,0.45), transparent 40%)' }} />
        <div className="container-custom relative py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm uppercase tracking-[0.2em] text-white/80">
              {tr('Marketplace etudiante', 'Student marketplace')}
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
              {tr('Achetez ou vendez des ressources qui accelerent vos projets.', 'Buy or sell resources that accelerate student projects.')}
            </h1>
            <p className="mt-4 text-lg text-white/80">
              {tr(
                'Templates CV, portfolios, ebooks, fiches de revision, Notion, Excel, UI kits: un espace unique pour equiper chaque etudiant.',
                'CV templates, portfolios, ebooks, revision sheets, Notion, Excel, UI kits: one place to equip every student.'
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/candidate/login">
                <Button>
                  {tr('Publier une ressource', 'Publish a resource')}
                </Button>
              </Link>
              <Button variant="outline">
                {tr('Voir les meilleures ventes', 'See top sellers')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom -mt-10 pb-12">
        <div className="rounded-2xl bg-white shadow-xl p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <Input
                label={tr('Rechercher une ressource', 'Search for a resource')}
                placeholder={tr('Ex: CV, Notion, revision reseaux...', 'e.g. CV, Notion, networking revision...')}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={tr('Prix minimum (FCFA)', 'Minimum price (XOF)')}
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
                <Input
                  label={tr('Prix maximum (FCFA)', 'Maximum price (XOF)')}
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">{tr('Categories populaires', 'Popular categories')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setSelectedCategory('all')}
                >
                  {tr('Toutes', 'All')}
                </button>
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                      selectedCategory === option.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                    onClick={() => setSelectedCategory(option.id)}
                  >
                    {option.short}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">
                {tr('Filtrez par type de ressource pour gagner du temps.', 'Filter by resource type to save time.')}
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <form onSubmit={handlePublish} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{tr('Publier une ressource', 'Publish a resource')}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {tr('Vendeur', 'Seller')}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {tr('Ajoutez votre ressource en quelques minutes.', 'Add your resource in a few minutes.')}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label={tr('Titre', 'Title')}
                  value={publishForm.title}
                  onChange={(event) => setPublishForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{tr('Categorie', 'Category')}</label>
                  <select
                    className="input-field"
                    value={publishForm.category}
                    onChange={(event) =>
                      setPublishForm((prev) => ({ ...prev, category: event.target.value as MarketplaceCategory }))
                    }
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label={tr('Prix (FCFA)', 'Price (XOF)')}
                  type="number"
                  min="0"
                  value={publishForm.price}
                  onChange={(event) => setPublishForm((prev) => ({ ...prev, price: event.target.value }))}
                  required
                />
                <Input
                  label={tr('Devise', 'Currency')}
                  value={publishForm.currency}
                  onChange={(event) => setPublishForm((prev) => ({ ...prev, currency: event.target.value }))}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{tr('Description', 'Description')}</label>
                <textarea
                  className="input-field min-h-[120px]"
                  value={publishForm.description}
                  onChange={(event) => setPublishForm((prev) => ({ ...prev, description: event.target.value }))}
                  required
                />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label={tr('URL image (optionnel)', 'Image URL (optional)')}
                  value={publishForm.previewImageUrl}
                  onChange={(event) => setPublishForm((prev) => ({ ...prev, previewImageUrl: event.target.value }))}
                  placeholder="https://..."
                />
                <Input
                  label={tr('URL fichier (optionnel)', 'File URL (optional)')}
                  value={publishForm.fileUrl}
                  onChange={(event) => setPublishForm((prev) => ({ ...prev, fileUrl: event.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Button type="submit" disabled={isPublishing}>
                  {isPublishing ? tr('Publication...', 'Publishing...') : tr('Publier', 'Publish')}
                </Button>
                {publishStatus && <span className="text-sm text-emerald-600">{publishStatus}</span>}
                {publishError && <span className="text-sm text-rose-600">{publishError}</span>}
                {publishAuthHint && <span className="text-sm text-amber-600">{publishAuthHint}</span>}
              </div>
            </form>
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
              <h3 className="text-lg font-semibold">{tr('Acheter rapidement', 'Quick purchase')}</h3>
              <p className="mt-2 text-sm text-white/80">
                {tr('Indiquez votre email pour recevoir le lien apres achat.', 'Provide your email to receive the link after purchase.')}
              </p>
              <div className="mt-4">
                <Input
                  label={tr('Email acheteur', 'Buyer email')}
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <p>{tr('Paiement securise, livraison instantanee.', 'Secure payment, instant delivery.')}</p>
                <p>{tr('Les vendeurs sont verifiees.', 'Sellers are verified.')}</p>
              </div>
              {purchaseStatus && <p className="mt-3 text-sm text-emerald-300">{purchaseStatus}</p>}
              {purchaseError && <p className="mt-3 text-sm text-rose-300">{purchaseError}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom pb-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{tr('Ressources disponibles', 'Available resources')}</p>
            <h2 className="text-2xl font-bold text-slate-900">
              {isLoading ? tr('Chargement...', 'Loading...') : tr(`${filteredItems.length} selection(s)`, `${filteredItems.length} selections`)}
            </h2>
          </div>
          <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            {tr('Nouveautes chaque semaine', 'New drops every week')}
          </div>
        </div>

        {itemsError && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {itemsError}
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const category = categoryOptions.find((option) => option.id === item.category);
            const style = CATEGORY_STYLE[item.category];
            return (
              <div key={item.id} className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`h-28 bg-gradient-to-br ${style.accent} p-4`}>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>
                    {category?.label || item.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-900">{formatPrice(item.price, item.currency)}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPurchasing === item.id}
                      onClick={() => handlePurchase(item.id)}
                    >
                      {isPurchasing === item.id ? tr('Achat...', 'Buying...') : tr('Acheter', 'Buy')}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && !isLoading && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            {tr('Aucune ressource ne correspond a vos filtres.', 'No resources match your filters.')}
          </div>
        )}
      </section>

      <section className="bg-slate-900">
        <div className="container-custom py-14 text-white">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h3 className="text-2xl font-bold">
                {tr('Vendez vos templates et montez en credibilite.', 'Sell your templates and build credibility.')}
              </h3>
              <p className="mt-3 text-white/80">
                {tr(
                  'Chaque vente finance vos projets et renforce votre portfolio. Publiez en 5 minutes.',
                  'Each sale funds your projects and strengthens your portfolio. Publish in 5 minutes.'
                )}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button>{tr('Devenir vendeur', 'Become a seller')}</Button>
              <Button variant="outline">{tr('Voir le guide', 'View the guide')}</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
