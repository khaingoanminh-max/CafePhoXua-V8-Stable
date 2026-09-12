/* Cafe Phố Xưa V8 - Local SEO layer */
(function (window, document) {
  'use strict';

  const SITE_URL = 'https://khaingoanminh-max.github.io/CafePhoXua-V8-Stable/';
  const LAT = 9.225081085887421;
  const LNG = 105.40630787569245;
  const STREET = '888 Quốc lộ 1A';

  function setMeta(name, content, property) {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(property ? 'property' : 'name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function addLocalContent() {
    if (document.getElementById('local-seo-gia-rai')) return;
    const contact = document.getElementById('contact');
    if (!contact) return;
    const section = document.createElement('section');
    section.id = 'local-seo-gia-rai';
    section.className = 'container';
    section.setAttribute('aria-label', 'Cafe Phố Xưa tại Giá Rai');
    section.innerHTML = `
      <div style="margin:28px auto 0;padding:22px;border:1px solid #eaded2;border-radius:18px;background:#fff;box-shadow:0 8px 24px rgba(62,36,18,.06)">
        <h2 style="margin:0 0 10px;color:#3d2415;font:700 28px Georgia,serif">Cafe Phố Xưa – 888 QL1A, Giá Rai</h2>
        <p style="margin:0;color:#6f6258;line-height:1.75">Nếu bạn đang tìm <strong>quán cafe gần đây ở Giá Rai</strong>, <strong>cafe khu vực Hộ Phòng</strong> hoặc quán cà phê gần <strong>Nam A Bank Giá Rai</strong>, hãy ghé <strong>Cafe Phố Xưa, số 888 Quốc lộ 1A</strong>. Quán nằm <strong>ngay cạnh Nam A Bank Giá Rai</strong>, phục vụ từ 06:00 đến 22:00 mỗi ngày với cà phê, trà, trà sữa, nước ép, sinh tố và đá xay.</p>
      </div>`;
    contact.appendChild(section);
  }

  function addStructuredData() {
    const old = document.getElementById('cpx-local-seo-jsonld');
    if (old) old.remove();
    const data = {
      '@context': 'https://schema.org',
      '@type': 'CafeOrCoffeeShop',
      '@id': SITE_URL + '#cafe-pho-xua',
      name: 'Cafe Phố Xưa',
      alternateName: 'Phố Xưa Coffee',
      url: SITE_URL,
      telephone: '+84868708799',
      priceRange: '15.000đ-40.000đ',
      image: SITE_URL + 'images/coffee-01.webp',
      description: 'Cafe Phố Xưa tại số 888 Quốc lộ 1A, khu vực Hộ Phòng, Giá Rai, Cà Mau, ngay cạnh Nam A Bank Giá Rai. Phục vụ cà phê, trà, trà sữa, nước ép, sinh tố và đá xay.',
      servesCuisine: ['Cà phê','Trà','Trà sữa','Nước ép','Sinh tố','Đá xay'],
      menu: SITE_URL + '#menu',
      address: {
        '@type': 'PostalAddress',
        streetAddress: STREET,
        addressLocality: 'Giá Rai',
        addressRegion: 'Cà Mau',
        addressCountry: 'VN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: LAT,
        longitude: LNG
      },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`,
      areaServed: [
        { '@type': 'City', name: 'Giá Rai' },
        { '@type': 'Place', name: 'Hộ Phòng' }
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '06:00',
        closes: '22:00'
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'cpx-local-seo-jsonld';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function init() {
    setMeta('geo.region', 'VN-CM');
    setMeta('geo.placename', '888 Quốc lộ 1A, Giá Rai, Cà Mau');
    setMeta('geo.position', `${LAT};${LNG}`);
    setMeta('ICBM', `${LAT}, ${LNG}`);
    setMeta('og:locality', 'Giá Rai', true);
    setMeta('og:region', 'Cà Mau', true);
    addStructuredData();
    addLocalContent();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();

  window.CafePhoXuaLocalSEO = Object.freeze({ version: '1.1.0', refresh: init });
})(window, document);
