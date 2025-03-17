import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {ArrowLeft, AlertTriangle} from "lucide-react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div
                className="text-center space-y-6 p-8 max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg animate-fade-in">
                <div className="flex justify-center">
                    <div
                        className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                        <AlertTriangle size={32}/>
                    </div>
                </div>

                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-xl text-muted-foreground">This page doesn't exist</p>

                <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200 ease-out"
                >
                    <ArrowLeft size={18}/>
                    Return to Game
                </a>
            </div>
        </div>
    );
};

export default NotFound;
