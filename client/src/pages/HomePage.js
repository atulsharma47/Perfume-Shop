import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import useScrollReveal from '../hooks/useScrollReveal';
import './HomePage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FALLBACK_PRODUCTS = [
  {
    _id: 'prod_1',
    name: 'Noir Absolu',
    brand: 'Maison Lumière',
    tagline: 'The darkness that seduces',
    description: 'A bold oud-leather accord wrapped in midnight rose and smoky incense.',
    fullDescription: 'Noir Absolu is an ode to dusk — the precise moment the sky surrenders its last blue.',
    price: 4200,
    originalPrice: 5500,
    category: 'Oriental',
    gender: 'Unisex',
    concentration: 'Extrait de Parfum',
    sizes: [{ ml: 30, price: 2800, inStock: true }, { ml: 50, price: 4200, inStock: true }],
    images: ['/images/bottle1_nobg.png', '/images/bottle2_nobg.png', '/images/bottle3_nobg.png'],
    thumbnailImage: '/images/bottle1_nobg.png',
    rating: 4.8,
    reviewCount: 3,
    badge: 'Bestseller',
    featured: true,
  },
  {
    _id: 'prod_2',
    name: 'Alba Bianca',
    brand: 'Maison Lumière',
    tagline: 'Light before the world wakes',
    description: 'White florals lifted by yuzu and morning dew on sun-warmed sandalwood.',
    price: 3600,
    category: 'Floral',
    gender: 'Women',
    concentration: 'Eau de Parfum',
    sizes: [{ ml: 50, price: 3600, inStock: true }],
    images: ['/images/bottle2_nobg.png', '/images/bottle3_nobg.png'],
    thumbnailImage: '/images/bottle2_nobg.png',
    rating: 4.6,
    reviewCount: 2,
    badge: 'New',
    featured: true,
  },
  {
    _id: 'prod_3',
    name: 'Forêt Sauvage',
    brand: 'Maison Lumière',
    tagline: 'Earth, bark, and solitude',
    description: 'Moss-covered pine and cold rain over dark patchouli and amber resin.',
    price: 3900,
    originalPrice: 4800,
    category: 'Woody',
    gender: 'Men',
    concentration: 'Eau de Parfum',
    sizes: [{ ml: 50, price: 3900, inStock: true }],
    images: ['/images/bottle3_nobg.png', '/images/bottle4_nobg.png'],
    thumbnailImage: '/images/bottle3_nobg.png',
    rating: 4.7,
    reviewCount: 2,
    badge: null,
    featured: true,
  },
  {
    _id: 'prod_4',
    name: 'Ambre Soleil',
    brand: 'Maison Lumière',
    tagline: 'Warm skin, golden hour',
    description: 'Tonka bean and benzoin over neroli and a whisper of saffron and honey.',
    price: 3200,
    category: 'Oriental',
    gender: 'Unisex',
    concentration: 'Eau de Toilette',
    sizes: [{ ml: 50, price: 3200, inStock: true }],
    images: ['/images/bottle4_nobg.png', '/images/bottle5_nobg.png'],
    thumbnailImage: '/images/bottle4_nobg.png',
    rating: 4.9,
    reviewCount: 2,
    badge: 'Bestseller',
    featured: true,
  },
  {
    _id: 'prod_5',
    name: 'Sel Marin',
    brand: 'Maison Lumière',
    tagline: 'Sea salt and distance',
    description: 'Driftwood and sea spray on a crisp accord of blue iris and white musks.',
    price: 2900,
    originalPrice: 3500,
    category: 'Aquatic',
    gender: 'Unisex',
    concentration: 'Eau de Toilette',
    sizes: [{ ml: 50, price: 2900, inStock: true }],
    images: ['/images/bottle5_nobg.png', '/images/bottle6_nobg.png'],
    thumbnailImage: '/images/bottle5_nobg.png',
    rating: 4.5,
    reviewCount: 1,
    badge: 'Limited',
    featured: false,
  },
  {
    _id: 'prod_6',
    name: 'Rose Noire',
    brand: 'Maison Lumière',
    tagline: 'The rose after midnight',
    description: 'Turkish rose and black currant on a base of dark woods and cistus.',
    price: 4800,
    category: 'Floral',
    gender: 'Women',
    concentration: 'Extrait de Parfum',
    sizes: [{ ml: 50, price: 4800, inStock: true }],
    images: ['/images/bottle6_nobg.png', '/images/bottle7_nobg.png'],
    thumbnailImage: '/images/bottle6_nobg.png',
    rating: 4.7,
    reviewCount: 2,
    badge: 'New',
    featured: false,
  },
];

function CountUp({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [featured, setFeatured] = useState(FALLBACK_PRODUCTS.filter((p) => p.featured));
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const pageRef = useScrollReveal('.reveal');

  const categories = ['All', 'Oriental', 'Floral', 'Woody', 'Aquatic'];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [allRes, featRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/products?featured=true`),
        ]);
        if (allRes.data?.data && allRes.data.data.length > 0) {
          setProducts(allRes.data.data);
        }
        if (featRes.data?.data && featRes.data.data.length > 0) {
          setFeatured(featRes.data.data);
        } else if (allRes.data?.data) {
          setFeatured(allRes.data.data.filter((p) => p.featured));
        }
      } catch (err) {
        console.warn('API connection offline, using default local catalog:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered =
    filter === 'All'
      ? products
      : products.filter((p) => p.category?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="home" ref={pageRef}>
      <HeroBanner onExplore={() => scrollToSection('collections')} onStory={() => scrollToSection('story')} />

      {/* Quote strip */}
      <section className="home__strip" id="story">
        <div className="container home__strip-inner">
          <p className="home__strip-text reveal">
            <em>"A fragrance is not made — it is discovered,</em> in the space between memory and longing."
          </p>
          <div className="home__strip-line" />
          <p className="home__strip-founder reveal reveal--delay-1">— Isabelle Morin, Founder</p>
        </div>
      </section>

      {/* Stats */}
      <section className="home__stats">
        <div className="container home__stats-grid">
          {[
            { label: 'Compositions', value: 48, suffix: '+' },
            { label: 'Countries served', value: 32, suffix: '' },
            { label: 'Artisan batches per year', value: 6, suffix: '' },
            { label: 'Years of craft', value: 12, suffix: '' },
          ].map((s, i) => (
            <div key={s.label} className={`home__stat reveal reveal--delay-${i}`}>
              <div className="home__stat-num">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="home__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="home__featured" id="featured">
        <div className="container">
          <p className="section-eyebrow reveal">Curated selection</p>
          <h2 className="section-title reveal reveal--delay-1">Bestsellers</h2>
          <div className="gold-line reveal reveal--delay-2" />

          {loading ? (
            <div className="home__grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="home__skeleton-card" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="home__empty">
              <p>No featured products yet. <button className="link-btn" onClick={() => scrollToSection('collections')}>Browse the full collection →</button></p>
            </div>
          ) : (
            <div className="home__grid">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home__cta-banner">
        <div className="home__cta-bg">
          <img
            src="/images/premium-cta.jpg"
            alt="Premium Discovery Set"
            className="home__cta-img-animated"
          />
          <div className="home__cta-overlay" />
        </div>
        <div className="container home__cta-content">
          <p className="section-eyebrow reveal">Limited time</p>
          <h2 className="home__cta-title reveal reveal--delay-1">
            The Signature<br /><em>Discovery Set</em>
          </h2>
          <p className="home__cta-body reveal reveal--delay-2">
            Six 5ml travel vials. Every composition in the current collection.<br />
            One lacquered box. The perfect way to find your signature.
          </p>
          <div className="home__cta-price reveal reveal--delay-3">
            <span className="home__cta-was">₹3,600</span>
            <span className="home__cta-now">₹2,499</span>
          </div>
          <button onClick={() => scrollToSection('collections')} className="btn btn--primary home__cta-btn reveal reveal--delay-4">
            Shop the Set
          </button>
        </div>
      </section>

      {/* Collections */}
      <section className="home__collections" id="collections">
        <div className="container">
          <p className="section-eyebrow reveal">Full range</p>
          <h2 className="section-title reveal reveal--delay-1">Collections</h2>
          <div className="gold-line reveal reveal--delay-2" />

          <div className="home__filters reveal reveal--delay-3">
            {categories.map((c) => (
              <button
                key={c}
                className={`home__filter-btn ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="home__grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="home__skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="home__grid">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="home__testimonials" id="reviews">
        <div className="container">
          <p className="section-eyebrow reveal">What our customers say</p>
          <h2 className="section-title reveal reveal--delay-1">Worn &amp; <em>Loved</em></h2>
          <div className="gold-line reveal reveal--delay-2" />
        </div>

        <div className="home__testi-track-wrap">
          <div className="home__testi-track">
            {[
              { user: 'Aryan M.', location: 'Mumbai', rating: 5, title: 'Absolutely magnetic', body: 'I wore Noir Absolu to a dinner and got three compliments before the appetisers arrived. The dry-down is pure luxury — smoky yet intimate.', product: 'Noir Absolu' },
              { user: 'Priya S.', location: 'Delhi', rating: 5, title: 'Worth every rupee', body: 'The sillage of Alba Bianca is extraordinary. I sprayed once in the morning and could still smell it on my scarf at midnight.', product: 'Alba Bianca' },
              { user: 'Vikram L.', location: 'Bangalore', rating: 5, title: 'Nothing else smells like this', body: 'Bought Forêt Sauvage on impulse, now it is my most-complimented scent. The patchouli-amber base is hypnotic — deep and warm without being heavy.', product: 'Forêt Sauvage' },
              { user: 'Anjali B.', location: 'Pune', rating: 5, title: 'Like a warm hug in a bottle', body: 'Ambre Soleil immediately felt calm when I smelled it. The honey-benzoin base is addictive. I have already bought a second bottle.', product: 'Ambre Soleil' },
              { user: 'Sneha R.', location: 'Chennai', rating: 5, title: 'My everyday signature', body: 'Effortless and elegant. It smells expensive without shouting. Perfect for the office and transitions beautifully into evening.', product: 'Alba Bianca' },
              { user: 'Neha G.', location: 'Hyderabad', rating: 5, title: 'Fresh without being generic', body: 'Every marine fragrance I tried before smelled like shampoo. Sel Marin is genuinely sophisticated — the iris makes all the difference.', product: 'Sel Marin' },
              { user: 'Ishita M.', location: 'Kolkata', rating: 5, title: 'The rose I was searching for', body: 'I have tried dozens of rose fragrances. Rose Noire is the only one that smells like an actual rose — complex, slightly thorny, and beautiful.', product: 'Rose Noire' },
              { user: 'Karan D.', location: 'Jaipur', rating: 5, title: 'Best unisex scent I have found', body: 'Wears beautifully on both me and my partner. The sillage is soft but persistent — compliments every single time.', product: 'Ambre Soleil' },
            ].concat([
              { user: 'Aryan M.', location: 'Mumbai', rating: 5, title: 'Absolutely magnetic', body: 'I wore Noir Absolu to a dinner and got three compliments before the appetisers arrived. The dry-down is pure luxury — smoky yet intimate.', product: 'Noir Absolu' },
              { user: 'Priya S.', location: 'Delhi', rating: 5, title: 'Worth every rupee', body: 'The sillage of Alba Bianca is extraordinary. I sprayed once in the morning and could still smell it on my scarf at midnight.', product: 'Alba Bianca' },
              { user: 'Vikram L.', location: 'Bangalore', rating: 5, title: 'Nothing else smells like this', body: 'Bought Forêt Sauvage on impulse, now it is my most-complimented scent. The patchouli-amber base is hypnotic — deep and warm without being heavy.', product: 'Forêt Sauvage' },
              { user: 'Anjali B.', location: 'Pune', rating: 5, title: 'Like a warm hug in a bottle', body: 'Ambre Soleil immediately felt calm when I smelled it. The honey-benzoin base is addictive. I have already bought a second bottle.', product: 'Ambre Soleil' },
            ]).map((t, i) => (
              <div key={i} className="home__testi-card">
                <div className="home__testi-quote">"</div>
                <div className="home__testi-stars">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= t.rating ? 'var(--clr-gold)' : 'var(--clr-border)'}>
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  ))}
                </div>
                <h4 className="home__testi-title">"{t.title}"</h4>
                <p className="home__testi-body">{t.body}</p>
                <div className="home__testi-footer">
                  <div className="home__testi-avatar">{t.user[0]}</div>
                  <div>
                    <p className="home__testi-user">{t.user}</p>
                    <p className="home__testi-meta">{t.location} · <span>{t.product}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container home__testi-cta reveal">
          <p className="home__testi-aggregate">
            <strong>4.7</strong> out of 5 &nbsp;·&nbsp; Based on <strong>500+</strong> verified reviews
          </p>
        </div>
      </section>

      {/* Atelier */}
      <section className="home__atelier" id="atelier">
        <div className="container home__atelier-inner">
          <div className="home__atelier-img-wrap reveal">
            <img
              src="/images/bottle8_nobg.png"
              alt="The Atelier"
              className="home__atelier-img-animated"
            />
            <div className="home__atelier-caption">
              <p className="section-eyebrow">The Atelier</p>
              <p>Grasse, France — Est. 2013</p>
            </div>
          </div>
          <div className="home__atelier-text">
            <p className="section-eyebrow reveal">Our craft</p>
            <h2 className="section-title reveal reveal--delay-1">Every bottle begins<br /><em>with a memory</em></h2>
            <div className="gold-line reveal reveal--delay-2" />
            <p className="reveal reveal--delay-3">
              We source our ingredients from a network of independent farmers and distillers
              who share our commitment to quality over yield. Taif rose picked at dawn.
              Oud resins aged for twenty years. Labdanum harvested by hand in Crete.
            </p>
            <p className="reveal reveal--delay-4" style={{ marginTop: 16 }}>
              Our compositions are never rushed. Each one takes between eighteen months
              and four years from first sketch to final bottle. We make fewer than six
              hundred units of any fragrance, and when they're gone, they're gone.
            </p>
            <button onClick={() => scrollToSection('story')} className="btn btn--ghost reveal reveal--delay-4" style={{ marginTop: 32 }}>
              Read the Full Story
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
