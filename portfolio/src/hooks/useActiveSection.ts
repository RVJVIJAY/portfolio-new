import { useEffect, useState } from 'react';

/** Returns the id of the section currently closest to the top of the viewport. */
export function useActiveSection(ids: string[], offset = 120) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '');

  // Depend on the joined ids so a fresh array on every render does not
  // re-subscribe the scroll listener each time.
  const key = ids.join('|');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionIds = key ? key.split('|') : [];
    if (sectionIds.length === 0) return;

    const handleScroll = () => {
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }

      // Pin the last section once the page is scrolled to the bottom.
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
      if (atBottom) current = sectionIds[sectionIds.length - 1];

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [key, offset]);

  return activeId;
}
