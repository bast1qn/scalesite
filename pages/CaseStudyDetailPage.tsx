
import React, { useState, useEffect } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { api } from '../lib/api';

// Static fallback for initial render or error
const staticPosts: any[] = [
    {
        id: "1",
        category: "Performance",
        title: "Warum Ladezeit der wichtigste Ranking-Faktor 2024 ist",
        excerpt: "Google liebt schnelle Websites...",
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        content: "<p>Fallback Content...</p>"
    }
];

// Basic sanitization function to prevent simple XSS attacks
const sanitizeHTML = (html: string) => {
    if (!html) return "";
    return html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "") // Remove scripts
        .replace(/on\w+="[^"]*"/g, "") // Remove inline event handlers (e.g. onclick)
        .replace(/on\w+='[^']*'/g, "")
        .replace(/javascript:/g, ""); // Remove javascript: protocol
};

interface CaseStudyDetailPageProps {
    setCurrentPage: (page: string) => void;
    postId: string | null;
}

const CaseStudyDetailPage: React.FC<CaseStudyDetailPageProps> = ({ setCurrentPage, postId }) => {
    const [post, setPost] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        const fetchPost = async () => {
            // Try to find in API list first (since we don't have a dedicated single post endpoint in this simplified backend)
            try {
                const { data } = await api.get('/blog');
                const found = data?.find((p: any) => p.id === postId);
                
                if (found) {
                    setPost(found);
                } else {
                    // Check statics
                    const staticFound = staticPosts.find(p => p.id === postId);
                    if(staticFound) setPost(staticFound);
                    else throw new Error("Artikel nicht gefunden");
                }
            } catch(e) {
                setError("Der Artikel konnte nicht geladen werden.");
            } finally {
                setLoading(false);
            }
        }
        
        if (postId) fetchPost();
        else {
            setLoading(false);
            setError("Keine ID übergeben");
        }

    }, [postId]);

    if (loading) {
        return (
            <main className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                    <div className="text-center pt-8 pb-12">
                        <div className="h-4 bg-dark-text/10 dark:bg-light-text/10 rounded w-1/4 mx-auto"></div>
                        <div className="mt-4 h-12 bg-dark-text/10 dark:bg-light-text/10 rounded w-3/4 mx-auto"></div>
                        <div className="mt-4 h-6 bg-dark-text/10 dark:bg-light-text/10 rounded w-1/2 mx-auto"></div>
                    </div>
                    <div className="aspect-video w-full rounded-2xl bg-dark-text/10 dark:bg-light-text/10 my-12"></div>
                    <div className="space-y-4">
                        <div className="h-6 bg-dark-text/10 dark:bg-light-text/10 rounded w-full"></div>
                        <div className="h-6 bg-dark-text/10 dark:bg-light-text/10 rounded w-full"></div>
                        <div className="h-6 bg-dark-text/10 dark:bg-light-text/10 rounded w-3/4"></div>
                    </div>
                </div>
            </main>
        );
    }
    
    if (!post || error) {
         return (
            <main className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-2xl font-bold">{error ? "Artikel nicht gefunden" : "Fehler beim Laden"}</h1>
                    <p className="mt-4">{error || "Der angeforderte Artikel konnte nicht gefunden werden."}</p>
                    <button onClick={() => setCurrentPage('blog')} className="mt-6 font-semibold text-primary hover:underline">
                        &larr; Zurück zum Blog
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <div className="text-center pt-8 pb-12">
                        <p className="text-base font-semibold text-primary tracking-wider uppercase">{post.category}</p>
                        <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-bold text-dark-text dark:text-light-text tracking-tight">
                            {post.title}
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/80 dark:text-light-text/80">
                            {post.excerpt}
                        </p>
                    </div>
                </AnimatedSection>
                
                <AnimatedSection>
                    <div className="aspect-video w-full rounded-2xl bg-accent-1/50 dark:brightness-90 my-12 shadow-lg overflow-hidden">
                        <img
                            src={post.image_url || "https://via.placeholder.com/1000x600?text=Kein+Bild"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </AnimatedSection>

                <AnimatedSection>
                    <div 
                        className="prose prose-lg dark:prose-invert max-w-none text-dark-text/80 dark:text-light-text/80 blog-content"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} 
                    />
                </AnimatedSection>
                
                <AnimatedSection>
                    <div className="mt-16 text-center border-t border-slate-200 dark:border-slate-800 pt-8">
                        <p className="text-sm text-slate-500 mb-4">Veröffentlicht am {new Date(post.created_at).toLocaleDateString()}</p>
                        <button 
                            onClick={() => setCurrentPage('blog')}
                            className="font-semibold text-primary hover:underline"
                        >
                            &larr; Zurück zur Blog-Übersicht
                        </button>
                    </div>
                </AnimatedSection>
            </div>
        </main>
    );
};

export default CaseStudyDetailPage;
