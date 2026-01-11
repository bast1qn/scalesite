
import React, { useState, useEffect, useMemo } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface Post {
    id: string;
    category: string;
    title: string;
    excerpt: string;
    author_name: string;
    created_at: string;
    image_url: string;
}

interface BlogPageProps {
    setCurrentPage: (page: string) => void;
    onPostSelect: (postId: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ setCurrentPage, onPostSelect }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    const fallbackPosts = useMemo(() => {
        const fallback = translations[language].blog_fallback as Array<{
            id: string;
            category: string;
            title: string;
            excerpt: string;
            author: string;
        }>;
        return fallback.map(post => ({
            id: post.id,
            category: post.category,
            title: post.title,
            excerpt: post.excerpt,
            author_name: post.author,
            created_at: "2024-03-15T10:00:00Z",
            image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
        }));
    }, [language]);

    useEffect(() => {
        setPosts(fallbackPosts);
    }, [fallbackPosts]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const { data } = await api.get('/blog');
                if (data && data.length > 0) {
                    setPosts(data);
                }
            } catch (e) {
                console.warn("Could not load blog posts, using fallback.");
            } finally {
                setLoading(false);
            }
        }
        loadPosts();
    }, []);

    return (
        <main className="py-24">
            <AnimatedSection>
                <div className="text-center pt-8 pb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-dark-text dark:text-light-text tracking-tight">
                        {t('blog_page.title')}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/80 dark:text-light-text/80">
                        {t('blog_page.subtitle')}
                    </p>
                </div>
            </AnimatedSection>

            <AnimatedSection stagger>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[300px]">
                    {loading ? (
                        <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                    ) : posts.length > 0 ? (
                        <div className="grid gap-12 lg:grid-cols-3 stagger-container">
                            {posts.map((post) => (
                                <button
                                    key={post.id}
                                    onClick={() => onPostSelect(post.id)}
                                    className="fancy-card group flex flex-col overflow-hidden rounded-2xl bg-surface dark:bg-dark-surface shadow-lg shadow-dark-text/5 dark:shadow-black/20 border border-transparent hover:border-primary text-left h-full"
                                >
                                    <div className="h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                                        <img
                                            src={post.image_url || "https://via.placeholder.com/400x300?text=No+Image"}
                                            alt={post.title}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between p-6">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-primary">
                                                <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-md">{post.category}</span>
                                            </p>
                                            <div className="mt-2 block">
                                                <p className="text-xl font-semibold text-dark-text dark:text-light-text group-hover:text-primary transition-colors line-clamp-2">{post.title}</p>
                                                <p className="mt-3 text-base text-dark-text/80 dark:text-light-text/80 line-clamp-3">{post.excerpt}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="text-sm text-dark-text/70 dark:text-light-text/70">
                                                <p className="font-semibold">{post.author_name || "Team ScaleSite"}</p>
                                                <p>{new Date(post.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center flex flex-col items-center justify-center p-12 bg-surface dark:bg-dark-surface rounded-2xl border border-dashed border-dark-text/10 dark:border-light-text/10">
                            <p className="text-xl font-bold text-dark-text dark:text-light-text mb-2">{t('blog_page.no_posts')}</p>
                            <p className="text-dark-text/70 dark:text-light-text/70">
                                {t('blog_page.no_posts_desc')}
                            </p>
                        </div>
                    )}
                </div>
            </AnimatedSection>
        </main>
    );
};

export default BlogPage;