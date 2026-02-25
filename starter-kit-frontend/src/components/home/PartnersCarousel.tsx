import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

interface PartnersCarouselProps {
  partners: Partner[];
}

export const PartnersCarousel: React.FC<PartnersCarouselProps> = ({ partners }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { tr } = useLanguage();

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container-custom">
        <h3 className="text-center text-2xl font-bold text-gray-900 mb-4">
          {tr('Ils nous soutiennent', 'They support us')}
        </h3>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          {tr(
            'Decouvrez les entreprises et organisations qui font confiance a StarterKit',
            'Discover the companies and organizations that trust StarterKit'
          )}
        </p>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          className="partners-carousel"
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <a href={partner.website || '#'} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="flex items-center justify-center h-24 bg-gray-50 rounded-xl p-4 group-hover:shadow-md transition-all">
                  {imageErrors[partner.id] ? (
                    <span className="text-gray-400 font-medium text-sm text-center">{partner.name}</span>
                  ) : (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={180}
                      height={80}
                      className="max-h-12 max-w-full grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={() => handleImageError(partner.id)}
                    />
                  )}
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
