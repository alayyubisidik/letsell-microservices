const Hero = () => {
    return (
        <section className="hero min-h-screen flex items-center bg-cover bg-center relative" id="home" style={{ backgroundImage: "url(/images/rog.jpg)" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent top-[70%] h-1/3"></div>
            <main className="content px-[8%] py-14  z-10 max-w-[70rem]">
                <h1 className="text-white text-4xl md:text-6xl font-bold leading-[3rem] text-shadow">
                    Your Ultimate <span className="bg-black/70 text-red-500 py-1 px-2 shadow-lg">Computer</span> Store
                </h1>
                <p className="text-white text-xl mt-4 leading-relaxed text-shadow">
                    Shop the newest laptops, desktops, and accessories.
                </p>
                <a href="#" className="cta mt-4 inline-block bg-red-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition duration-300">
                    Buy Now
                </a>
            </main>
        </section>
    );
};

export default Hero;
