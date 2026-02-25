import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { StarIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

const testimonials = [
  {
    id: '1',
    name: 'Thomas M.',
    roleFr: 'Donateur regulier',
    roleEn: 'Regular donor',
    contentFr: 'Contribuer a StarterKit est la meilleure decision que j ai prise.',
    contentEn: 'Contributing to StarterKit is one of the best decisions I have made.',
    rating: 5,
    avatar: '/images/testimonials/donor1.jpg',
  },
  {
    id: '2',
    name: 'Sophie A.',
    roleFr: 'Beneficiaire PC Standard',
    roleEn: 'Standard PC beneficiary',
    contentFr: 'Grace au programme, j ai obtenu l ordinateur necessaire a mes etudes web.',
    contentEn: 'Thanks to the program, I got the laptop I needed for my web studies.',
    rating: 5,
    avatar: '/images/testimonials/student1.jpg',
  },
  {
    id: '3',
    name: 'Marc K.',
    roleFr: 'Recruteur - TechStart',
    roleEn: 'Recruiter - TechStart',
    contentFr: 'La qualite des profils est excellente et le matching est tres utile.',
    contentEn: 'Profile quality is excellent and matching is very useful.',
    rating: 5,
    avatar: '/images/testimonials/recruiter1.jpg',
  },
];

export const Testimonials: React.FC = () => {
  const { tr, isEn } = useLanguage();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {tr('Ce qu ils disent de nous', 'What they say about us')}
          </h2>
          <p className="text-lg text-gray-600">{tr('Decouvrez les temoignages de notre communaute', 'Discover testimonials from our community')}</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white rounded-xl p-6 shadow-lg h-full flex flex-col">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 flex-1 italic">&quot;{isEn ? testimonial.contentEn : testimonial.contentFr}&quot;</p>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{isEn ? testimonial.roleEn : testimonial.roleFr}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
