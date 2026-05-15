import * as THREE from 'three';
import { useRef, useEffect } from 'react';

const asset = (name: string) => `/solution-insight/${name}`;

const navItems = ['About Us', 'Services', 'Skills', 'Team', 'Partner', 'Our Client', 'Contact Us'];

const services = [
  ['Back-Office Development', 'Robust back-office systems that streamline operations and improve productivity.', 'browser'],
  ['Workflow Management', 'Automate and manage business processes efficiently with smart workflows.', 'workflow'],
  ['Bank Reconciliation', 'Accurate and automated bank reconciliation for complete financial confidence.', 'bank'],
  ['Data Dashboard', 'Real-time dashboards and reports that turn data into actionable insights.', 'chart'],
  ['Internal Workflow', 'Optimize internal processes and enhance team collaboration seamlessly.', 'nodes'],
  ['Custom Software Solutions', 'Tailored software built to solve your unique business challenges.', 'cube'],
];

const technologies = [
  ['React', 'react-logo.png'],
  ['TypeScript', 'ts-logo.png'],
  ['Java', 'java-logo.png'],
  ['Spring Boot', 'spring-boot-logo.png'],
  ['PostgreSQL', 'postgresql-logo.png'],
  ['MySQL', 'mysql-logo.png'],
  ['Redis', 'redis-logo.png'],
  ['HTML5', 'html-logo.png'],
  ['CSS3', 'css-logo.png'],
  ['Material UI', 'mui-logo.png'],
  ['Redux', 'redux-logo.png'],
  ['Modern Tools', 'ts-logo.png'],
];

const team = [
  ['9+ Years', 'Software Business Solution Consultant & Development', 'concept/team-1.png'],
  ['4+ Years', 'Front End Developer & UX/UI Design', 'concept/team-2.png'],
  ['3+ Years', 'Backend Developer & API Integration Expert', 'concept/team-3.png'],
];

type ServiceIconProps = {
  type: string;
};

function ServiceIcon({ type }: ServiceIconProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2.3,
  };

  if (type === 'browser') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="12" y="15" width="40" height="34" rx="3" {...common} />
        <path d="M12 24h40M20 20h.1M26 20h.1" {...common} />
        <path d="M22 35h10M22 41h20" {...common} />
      </svg>
    );
  }

  if (type === 'workflow') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="11" y="12" width="15" height="15" rx="3" {...common} />
        <rect x="38" y="12" width="15" height="15" rx="3" {...common} />
        <rect x="11" y="38" width="15" height="15" rx="3" {...common} />
        <rect x="38" y="38" width="15" height="15" rx="3" {...common} />
        <path d="M26 20h12M19 27v11M45 27v11M26 46h12" {...common} />
      </svg>
    );
  }

  if (type === 'bank') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 25h44L32 12 10 25ZM16 25v24M26 25v24M38 25v24M48 25v24M12 49h40" {...common} />
      </svg>
    );
  }

  if (type === 'chart') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M31 12a20 20 0 1 0 20 20H31V12Z" {...common} />
        <path d="M38 11v14h14A18 18 0 0 0 38 11Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === 'nodes') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="26" y="10" width="12" height="12" rx="2" {...common} />
        <rect x="10" y="42" width="12" height="12" rx="2" {...common} />
        <rect x="42" y="42" width="12" height="12" rx="2" {...common} />
        <path d="M32 22v10M16 42V32h32v10" {...common} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="m32 10 20 11v22L32 54 12 43V21l20-11Z" {...common} />
      <path d="M12 21 32 32l20-11M32 32v22" {...common} />
    </svg>
  );
}

function CodeCanvas3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.52, 7.7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.scale.setScalar(0.92);
    scene.add(root);

    const makePanelTexture = (title: string, color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#08172d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);
        ctx.fillStyle = '#ff7a00';
        ctx.beginPath();
        ctx.arc(44, 42, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#34d2ff';
        ctx.beginPath();
        ctx.arc(72, 42, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '700 38px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(title, 38, 105);
        ctx.font = '24px Arial';
        ['const site = build();', 'api.sync(workflow);', 'dashboard.render();'].forEach((line, index) => {
          ctx.fillStyle = index === 1 ? '#ff9d3d' : '#82e9ff';
          ctx.fillText(line, 48, 165 + index * 48);
        });
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const panelGeometry = new THREE.BoxGeometry(2.45, 1.48, 0.12);
    const panels = [
      { title: 'Website', x: 0, y: 0.24, z: 0, ry: 0 },
      { title: 'Dashboard', x: -2.25, y: 0.98, z: -0.65, ry: 0.34 },
      { title: 'API', x: 2.22, y: 1.05, z: -0.85, ry: -0.34 },
      { title: 'Back Office', x: 1.52, y: -1.12, z: -0.5, ry: -0.2 },
    ];

    panels.forEach((panel, index) => {
      const material = new THREE.MeshStandardMaterial({
        map: makePanelTexture(panel.title, index % 2 ? '#34d2ff' : '#ff7a00'),
        roughness: 0.36,
        metalness: 0.25,
      });
      const mesh = new THREE.Mesh(panelGeometry, material);
      mesh.position.set(panel.x, panel.y, panel.z);
      mesh.rotation.y = panel.ry;
      root.add(mesh);
    });

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.012, 12, 120),
      new THREE.MeshBasicMaterial({ color: '#34d2ff', transparent: true, opacity: 0.72 })
    );
    torus.rotation.x = Math.PI / 2.7;
    root.add(torus);

    const orbiters = Array.from({ length: 9 }, (_, index) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(index % 3 === 0 ? 0.08 : 0.045, 24, 24),
        new THREE.MeshBasicMaterial({ color: index % 2 ? '#34d2ff' : '#ff7a00' })
      );
      root.add(mesh);
      return mesh;
    });

    const gear = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.38, 0.12, 88, 10),
      new THREE.MeshStandardMaterial({ color: '#dcecff', roughness: 0.32, metalness: 0.6 })
    );
    gear.position.set(-1.2, -1.45, 0.2);
    root.add(gear);

    scene.add(new THREE.AmbientLight('#dbefff', 1.1));
    const point = new THREE.PointLight('#4fdcff', 2.2, 12);
    point.position.set(1.8, 2.5, 3.2);
    scene.add(point);

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    let frame = 0;
    let animationId = 0;

    const animate = () => {
      frame += 0.012;
      root.rotation.y = Math.sin(frame * 0.72) * 0.16;
      root.rotation.x = Math.sin(frame * 0.45) * 0.045;
      torus.rotation.z += 0.006;
      gear.rotation.x += 0.01;
      gear.rotation.y += 0.014;

      orbiters.forEach((orbiter, index) => {
        const angle = frame * (0.9 + index * 0.03) + index * 0.72;
        orbiter.position.set(Math.cos(angle) * 2.7, Math.sin(angle * 1.15) * 1.25, Math.sin(angle) * 0.7);
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="si-hero-3d" aria-hidden="true" />;
}

export default function CompanyLanding() {
  return (
    <main className="si-page">
      <header className="si-header">
        <a className="si-brand" href="#top" aria-label="Solution Insight home">
          <img src={asset('solution-insight-logo.png')} alt="Solution Insight" />
        </a>
        <nav className="si-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} key={item}>
              {item}
            </a>
          ))}
        </nav>
        <a className="si-header-cta" href="#contact-us">Get In Touch</a>
      </header>

      <section className="si-hero" id="top">
        <div className="si-hero-content">
          <h1>We build websites and back-office systems that drive your business forward.</h1>
          <p>
            Solution Insight creates custom software, secure workflows, dashboards, payment operations,
            and scalable web platforms tailored to your business needs.
          </p>
          <div className="si-hero-actions">
            <a className="si-primary-button" href="#contact-us">Let&apos;s Talk</a>
            <a className="si-secondary-button" href="#our-client">View Our Work</a>
          </div>
          <div className="si-proof-row" aria-label="Company strengths">
            <span>Business-focused solutions</span>
            <span>Secure and reliable delivery</span>
            <span>Scalable web platforms</span>
          </div>
        </div>
        <CodeCanvas3D />
      </section>

      <section className="si-section si-about" id="about-us">
        <div>
          <p className="si-section-label">About Us</p>
          <h2>Custom software solutions made for your business.</h2>
          <p>
            We are a software development company dedicated to creating custom software solutions tailored
            to your business needs. With a deep understanding of diverse requirements, we design solutions
            that perfectly align with your business objectives.
          </p>
          <p>
            Our experienced team adapts and fine-tunes every solution to meet the specific needs of your
            business, from user experience to system integration.
          </p>
        </div>
        <aside className="si-vision-card">
          <p className="si-section-label">Vision</p>
          <p>
            To be the trusted partner for businesses worldwide, empowering them with innovative and
            user-centric software solutions that drive growth, efficiency, and digital transformation.
          </p>
          <div className="si-mini-tech">
            <img src={asset('ts-logo.png')} alt="TypeScript" />
            <img src={asset('java-logo.png')} alt="Java" />
          </div>
        </aside>
      </section>

      <section className="si-section" id="services">
        <p className="si-section-label si-centered">Our Services</p>
        <h2 className="si-centered">Software built around business operations.</h2>
        <div className="si-service-grid">
          {services.map(([title, description, icon]) => (
            <article className="si-service-card" key={title}>
              <span className="si-service-icon">
                <ServiceIcon type={icon} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="si-section" id="skills">
        <p className="si-section-label si-centered">Our Skills & Technologies</p>
        <h2 className="si-centered">Modern stack for websites, APIs, and dashboards.</h2>
        <div className="si-tech-grid">
          {technologies.map(([name, image]) => (
            <article className="si-tech-card" key={name}>
              <img src={asset(image)} alt={name} />
              <span>{name}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="si-section si-trust-grid">
        <div className="si-team-panel" id="team">
          <p className="si-section-label">Our Team</p>
          {team.map(([years, description, image]) => (
            <div className="si-team-row" key={years}>
              <img src={asset(image)} alt="" />
              <div>
                <h3>{years}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="si-partner-panel" id="partner">
          <p className="si-section-label">Partner & Security</p>
          <div className="si-partner-heading">
            <img src={asset('cyberinno-logo.jpg')} alt="CyberInno" className="si-partner-logo" />
            <div>
              <h3>CyberInno Co., Ltd.</h3>
              <p>Cybersecurity partner for resilient business systems.</p>
            </div>
          </div>
          <div className="si-security-tags" aria-label="Security capabilities">
            <span>ISO/IEC 27001</span>
            <span>ISO/IEC 27701</span>
            <span>PDPA</span>
          </div>
          <ul>
            <li>Penetration testing before release</li>
            <li>Vulnerability assessment and remediation</li>
            <li>Security baseline and hardening review</li>
          </ul>
          <img src={asset('security-shield.svg')} alt="" className="si-shield" />
        </div>

        <div className="si-client-panel" id="our-client">
          <p className="si-section-label">Our Client - 2025</p>
          <img src={asset('checkrace-case.png')} alt="Checkrace" className="si-checkrace-logo" />
          <p>
            Developed a registration and data management system for running events, with payment gateway
            and thermal slip support for payment processing and product receipt management.
          </p>
          <div className="si-client-metrics" aria-label="Checkrace solution highlights">
            <span>Registration</span>
            <span>Payments</span>
            <span>Thermal slips</span>
          </div>
          <div className="si-client-preview" aria-hidden="true">
            <div className="si-preview-window">
              <div className="si-preview-toolbar" />
              <div className="si-preview-grid">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="si-preview-phone">
              <span />
              <strong>QR</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="si-contact" id="contact-us">
        <div>
          <p className="si-section-label">Contact Us</p>
          <h2>Let&apos;s build something great together.</h2>
        </div>
        <address>
          <span className="si-contact-icon">●</span>
          <strong>Mailing Address</strong>
          197/14 Village No. 13, Soi Suksawat Niwet 1, Suksawat Road, Nai Khlong Bang Plakot
          Subdistrict, Phra Samut Chedi District, Samut Prakan Province 10290
        </address>
        <a href="mailto:atiwat.k@solutioninsight.tech">
          <span className="si-contact-icon">✉</span>
          <strong>Email Address</strong>
          atiwat.k@solutioninsight.tech
        </a>
        <a href="tel:0889023466">
          <span className="si-contact-icon">☎</span>
          <strong>Phone Number</strong>
          088-902-3466
        </a>
      </section>

      <footer className="si-footer">
        <div className="si-footer-brand">
          <img src={asset('footer-logo-white.png')} alt="Solution Insight" />
          <p>Custom software development company delivering modern, secure and scalable solutions for businesses.</p>
        </div>
        <div className="si-footer-links">
          <h3>Quick Links</h3>
          <div>
            {navItems.map((item) => (
              <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} key={item}>
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="si-footer-social">
          <h3>Follow Us</h3>
          <div>
            <a href="#contact-us" aria-label="LinkedIn">in</a>
            <a href="#contact-us" aria-label="Facebook">f</a>
            <a href="mailto:atiwat.k@solutioninsight.tech" aria-label="Email">✉</a>
          </div>
        </div>
        <span className="si-copyright">© 2025 Solution Insight Co., Ltd. All rights reserved.</span>
      </footer>
    </main>
  );
}
