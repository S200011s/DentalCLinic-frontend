import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function SlugPage({
  type,       // "doctor" | "service"
  fetchById,  // (id) => Promise<entity>
  getSlug,    // (entity) => base slug
  getShortId, // optional — only for collision types (doctor)
  Render,
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");

    (async () => {
      try {
        // Legacy 24-hex Mongo id → redirect to canonical slug
        if (/^[a-f0-9]{24}$/i.test(slug)) {
          const { data } = await axiosInstance.get(
            `/slug/id-to-slug/${type}/${slug}`
          );
          navigate(`/${type}s/${data.slug}`, { replace: true });
          return;
        }

        const { data } = await axiosInstance.get(
          `/slug/resolve/${type}/${slug}`
        );

        if (data.multiple) {
          const short = slug.match(/-([a-f0-9]{6})$/i)?.[1];
          const chosen = short
            ? data.candidates.find((c) => c.slug.endsWith(`-${short}`))
            : null;

          if (!chosen) {
            navigate(`/${type}s/${data.candidates[0].slug}`, {
              replace: true,
            });
            return;
          }
          const fetched = await fetchById(chosen.id);
          if (cancelled) return;
          setEntity(fetched);
          setState("ready");
          return;
        }

        const fetched = await fetchById(data.id);
        if (cancelled) return;

        // const canonicalBase = getSlug(fetched);
        // const hasShortId =
        //   getShortId && slug.startsWith(`${canonicalBase}-`);
        const canonicalBase = getSlug(fetched);
const shortId = getShortId ? getShortId(fetched) : null;
const hasShortId = shortId && slug.startsWith(`${canonicalBase}-`);
        const isBase = slug === canonicalBase;

        if (!isBase && !hasShortId) {
          const short = getShortId ? `-${getShortId(fetched)}` : "";
          navigate(`/${type}s/${canonicalBase}${short}`, {
            replace: true,
          });
          return;
        }

        setEntity(fetched);
        setState("ready");
      } catch (err){
          console.error("SlugPage error:", err);

        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, type]);

  if (state === "loading") {
    return (
      <div
        className="flex items-center justify-center py-20"
        style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: "#64748b" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-red-600">Not found</p>
      </div>
    );
  }

  return <Render entity={entity} />;
}