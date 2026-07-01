import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-gray-950" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 border border-gray-800 py-16 lg:py-20 px-8 lg:px-12 shadow-[0_20px_60px_rgb(0,0,0,0.4)] flex flex-col lg:flex-row items-center justify-between min-h-[400px]">
          {/* Left Content */}
          <div className="relative z-10 flex flex-col items-start text-left lg:w-[55%]">
            <h2 id="cta-heading" className="mb-4 text-3xl font-bold text-white tracking-tighter sm:text-4xl leading-tight">
              Ready to get paid on time?
            </h2>
            <p className="mb-8 text-base lg:text-lg leading-relaxed text-gray-400 font-medium max-w-lg">
              Join thousands of freelancers who use Invoiceser to take the stress
              out of billing and get back to their real work.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgb(37,99,235,0.3)] hover:bg-primary-500"
            >
              Create your free account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Right Graphic (Orbits) */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full lg:w-[45%] h-[600px] flex items-center justify-center pointer-events-none opacity-20 lg:opacity-100">
            <div className="relative w-[600px] h-[600px] flex items-center justify-center translate-x-1/4 scale-75 lg:scale-90 origin-right">
              {/* Center Icon */}
              <div className="absolute w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 z-10">
                <Receipt className="w-10 h-10 text-white/80" />
              </div>
              
              {/* Inner Ring */}
              <div className="absolute w-[220px] h-[220px] rounded-full border border-gray-800" />
              <div className="absolute w-12 h-12 rounded-full overflow-hidden border-[3px] border-gray-950" style={{ transform: 'rotate(200deg) translate(110px) rotate(-200deg)' }}>
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-10 h-10 rounded-full overflow-hidden border-[3px] border-gray-900" style={{ transform: 'rotate(60deg) translate(110px) rotate(-60deg)' }}>
                <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              
              <div className="absolute w-[380px] h-[380px] rounded-full border border-gray-800" />
              <div className="absolute w-14 h-14 rounded-full overflow-hidden border-[3px] border-gray-950" style={{ transform: 'rotate(320deg) translate(190px) rotate(-320deg)' }}>
                <img src="https://randomuser.me/api/portraits/men/53.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-12 h-12 rounded-full overflow-hidden border-[3px] border-gray-900" style={{ transform: 'rotate(140deg) translate(190px) rotate(-140deg)' }}>
                <img src="https://randomuser.me/api/portraits/women/17.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-10 h-10 rounded-full overflow-hidden border-[3px] border-gray-900" style={{ transform: 'rotate(250deg) translate(190px) rotate(-250deg)' }}>
                <img src="https://randomuser.me/api/portraits/women/64.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              
              {/* Outer Ring */}
              <div className="absolute w-[540px] h-[540px] rounded-full border border-gray-800" />
              <div className="absolute w-16 h-16 rounded-full overflow-hidden border-[3px] border-gray-950" style={{ transform: 'rotate(280deg) translate(270px) rotate(-280deg)' }}>
                <img src="https://randomuser.me/api/portraits/men/77.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-12 h-12 rounded-full overflow-hidden border-[3px] border-gray-900" style={{ transform: 'rotate(110deg) translate(270px) rotate(-110deg)' }}>
                <img src="https://randomuser.me/api/portraits/women/19.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-14 h-14 rounded-full overflow-hidden border-[3px] border-gray-900" style={{ transform: 'rotate(170deg) translate(270px) rotate(-170deg)' }}>
                <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-10 h-10 rounded-full overflow-hidden border-[3px] border-gray-900" style={{ transform: 'rotate(190deg) translate(270px) rotate(-190deg)' }}>
                <img src="https://randomuser.me/api/portraits/women/51.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
