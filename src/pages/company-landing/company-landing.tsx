import * as THREE from 'three';
import { useRef, useEffect } from 'react';

const asset = (name: string) => `/solution-insight/${name}`;

const navItems = ['About Us', 'Services', 'Skills', 'Team', 'Partner', 'Our Client', 'Contact Us'];

const services = [
  ['Back-Office Development', 'Robust systems that streamline operations and improve productivity.'],
  ['Workflow Management', 'Automate business processes with smart workflows made for your team.'],
  ['Bank Reconciliation', 'Accurate financial reconciliation for confident payment operations.'],
  ['Data Dashboard', 'Real-time dashboards and reports that turn data into decisions.'],
  ['Internal Workflow', 'Optimize internal processes and improve collaboration across departments.'],
  ['Custom Software Solutions', 'Tailored software built around your business challenge.'],
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
  ['9+ Years', 'Software Business Solution Consultant & Development'],
  ['4+ Years', 'Front End Developer & UX/UI Design'],
  ['3+ Years', 'Backend Developer & API Integration Expert'],
];

function CodeCanvas3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.62, 6.3);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.scale.setScalar(1.08);
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
          {services.map(([title, description]) => (
            <article className="si-service-card" key={title}>
              <span className="si-service-icon" />
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
          {team.map(([years, description], index) => (
            <div className="si-team-row" key={years}>
              <span>{index + 1}</span>
              <div>
                <h3>{years}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="si-partner-panel" id="partner">
          <p className="si-section-label">Partner & Security</p>
          <img src={asset('cyberinno-logo.jpg')} alt="CyberInno" className="si-partner-logo" />
          <h3>CyberInno Co., Ltd.</h3>
          <p>&quot;Next Generation of Innovative Cybersecurity for Resilience of your Business&quot;</p>
          <ul>
            <li>ISO/IEC 27001, ISO/IEC 27701 (PDPA)</li>
            <li>Penetration Testing</li>
            <li>Vulnerability Assessment (VA)</li>
            <li>Security Baseline & Hardening</li>
          </ul>
          <span className="si-shield" aria-hidden="true" />
        </div>

        <div className="si-client-panel" id="our-client">
          <p className="si-section-label">Our Client - 2025</p>
          <h3>Checkrace</h3>
          <p>
            Developed a registration and data management system for running events, with payment gateway
            and thermal slip support for payment processing and product receipt management.
          </p>
          <img src={asset('checkrace-case.png')} alt="Checkrace platform case study" />
        </div>
      </section>

      <section className="si-contact" id="contact-us">
        <div>
          <p className="si-section-label">Contact Us</p>
          <h2>Let&apos;s build something great together.</h2>
        </div>
        <address>
          <strong>Mailing Address</strong>
          197/14 Village No. 13, Soi Suksawat Niwet 1, Suksawat Road, Nai Khlong Bang Plakot
          Subdistrict, Phra Samut Chedi District, Samut Prakan Province 10290
        </address>
        <a href="mailto:atiwat.k@solutioninsight.tech">
          <strong>Email Address</strong>
          atiwat.k@solutioninsight.tech
        </a>
        <a href="tel:0889023466">
          <strong>Phone Number</strong>
          088-902-3466
        </a>
      </section>

      <footer className="si-footer">
        <img src={asset('solution-insight-logo.png')} alt="Solution Insight" />
        <p>Custom software development company delivering secure, scalable solutions for your business.</p>
        <span>© 2025 Solution Insight Co., Ltd. All rights reserved.</span>
      </footer>
    </main>
  );
}
