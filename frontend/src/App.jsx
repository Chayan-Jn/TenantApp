import { RouterProvider } from 'react-router'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { useEffect } from 'react'
import router from './router.jsx'

export default function App() {
  useEffect(() => {
    const updateCanonical = (location) => {
      let canonicalLink = document.querySelector("link[rel='canonical']");
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", window.location.origin + location.pathname);
    };

    if (router.state && router.state.location) {
      updateCanonical(router.state.location);
    } else {
      updateCanonical(window.location);
    }

    const unsubscribe = router.subscribe((state) => {
      updateCanonical(state.location);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </>
  )
}