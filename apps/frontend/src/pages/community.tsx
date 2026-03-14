import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Zap, 
  Trophy,
  Loader2,
  Plus,
  Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile, usePosts, useCreatePost, useToggleLike, useTopOperatives } from "@/hooks/use-db-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Community() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [filter, setFilter] = useState("ALL");
  const [newPostContent, setNewPostContent] = useState("");
  const { toast } = useToast();

  const { data: posts, isLoading } = usePosts(filter);
  const { data: topOperatives, isLoading: isLoadingTop } = useTopOperatives();
  const createPostMutation = useCreatePost();
  const toggleLikeMutation = useToggleLike();

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    try {
      await createPostMutation.mutateAsync({
        content: newPostContent,
        type: 'GENERAL'
      });
      setNewPostContent("");
      toast({ title: "Sync Successful", description: "Your update is now on the grid." });
    } catch (err: any) {
      toast({ title: "Sync Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleToggleLike = async (postId: string, hasLiked: boolean) => {
    try {
      await toggleLikeMutation.mutateAsync({ postId, hasLiked });
    } catch (err: any) {
      toast({ title: "Likage Error", description: err.message, variant: "destructive" });
    }
  };

  const getRankTier = (lvl: number) => {
    if (lvl < 5) return "NEURAL INITIATE";
    if (lvl < 15) return "PULSE OPERATIVE";
    if (lvl < 30) return "KINETIC ENFORCER";
    if (lvl < 50) return "SYNAPSE ELITE";
    return "CYBERNETIC OVERLORD";
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
            <div>
              <h1 className="text-4xl font-display font-black tracking-widest uppercase text-glow">The Grid</h1>
              <p className="text-muted-foreground font-sans mt-1 text-sm">Neural update stream for all connected operatives.</p>
            </div>
            <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5 backdrop-blur-md">
              {["ALL", "PROGRESS", "ROUTINE", "QUESTION"].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                    filter === f ? "bg-primary text-black box-glow" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Create Post Interface */}
          <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Users className="w-24 h-24 rotate-12" />
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" />
                ) : <Users className="w-6 h-6 text-muted-foreground" />}
              </div>
              <div className="flex-1 space-y-4">
                <textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="SYNC YOUR UPDATE TO THE GRID..."
                  className="w-full bg-transparent border-none focus:ring-0 text-xl font-display font-medium placeholder:text-muted-foreground/30 resize-none min-h-[80px]"
                />
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-all">
                      <Zap className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || createPostMutation.isPending}
                    className="bg-primary text-black px-6 py-2 rounded-lg font-display font-bold uppercase tracking-[0.15em] text-xs hover:bg-primary/80 transition-all box-glow flex items-center gap-2 disabled:opacity-50"
                  >
                    {createPostMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Initialize Sync
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Post Feed */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="font-mono text-xs uppercase tracking-widest">Scanning Grid Frequencies...</span>
              </div>
            ) : posts?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 bg-card/20 rounded-2xl border border-white/5">
                <Zap className="w-10 h-10 opacity-20" />
                <span className="font-mono text-xs uppercase tracking-widest">No active neural links found.</span>
              </div>
            ) : posts?.map((post, idx) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 group/post hover:border-primary/20 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary border border-primary/20 flex flex-shrink-0 items-center justify-center overflow-hidden">
                       {post.profiles?.avatar_url ? (
                         <img src={post.profiles.avatar_url} className="w-full h-full object-cover" />
                       ) : <Zap className="w-5 h-5 text-primary opacity-50" />}
                    </div>
                    <div>
                      <div className="font-display font-bold text-lg leading-none flex items-center gap-2">
                        {post.profiles?.full_name || 'Subject Alpha'}
                        {post.profiles?.level && post.profiles.level > 20 && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 uppercase font-black">ELITE</span>
                        )}
                      </div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                        RANK: <span className="text-primary">{getRankTier(post.profiles?.level || 1)} (LVL {post.profiles?.level || 1})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true }).toUpperCase()}
                  </div>
                </div>

                <p className="text-foreground/90 font-sans text-base leading-relaxed mb-6">
                  {post.content}
                </p>

                {post.routine_id && (
                  <button className="w-full mb-6 py-3 bg-secondary/50 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" /> VIEW LINKED ROUTINE
                  </button>
                )}

                <div className="flex gap-6 items-center border-t border-white/5 pt-4">
                  <button 
                    onClick={() => handleToggleLike(post.id, post.user_has_liked)}
                    className={cn(
                      "flex items-center gap-2 transition-all group/stat",
                      post.user_has_liked ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", post.user_has_liked && "fill-primary")} />
                    <span className="text-xs font-bold">{post.likes_count}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-all group/stat">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-bold">{post.comments_count}</span>
                  </button>
                  <button className="ml-auto text-muted-foreground hover:text-white transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Trending & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" /> High Rank Operatives
            </h4>
            <div className="space-y-4">
              {isLoadingTop ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-primary/40" />
                </div>
              ) : topOperatives?.map((op, idx) => (
                <div key={idx} className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/50 flex flex-col items-center justify-center border border-white/5 group-hover:border-primary/30">
                      <span className="text-[8px] font-bold">#{idx + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold font-sans group-hover:text-primary transition-colors truncate max-w-[120px]">
                        {op.full_name || op.username || 'Anonymous'}
                      </div>
                      <div className="text-[8px] text-muted-foreground uppercase">LEVEL {op.level}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-primary font-bold">{(op.xp || 0).toLocaleString()} XP</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
              VIEW ALL OPERATIVES
            </button>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
               <Zap className="w-32 h-32 text-primary" />
             </div>
             <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
               <Rocket className="w-3.5 h-3.5" /> Training Oracle
             </h4>
             <p className="text-xs text-foreground/70 leading-relaxed mb-4 italic">
               "Operational data suggests your current hypertrophy cycle is peaking. Stabilize core volume to prevent CNS degradation."
             </p>
             <div className="h-px bg-primary/20 my-4" />
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary box-glow" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Volume Trend: +12%</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent box-glow" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Focus: Posterior Chain</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
