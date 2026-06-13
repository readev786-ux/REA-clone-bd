-- =====================================================================
-- AHS Properties — seed data (developments, units, partners, FAQ,
-- insights, testimonials). Run after 0001_schema_rls_triggers.sql.
-- =====================================================================

insert into public.projects
  (slug, name, tagline, description, category, location, address, district, completion, scheme, co_broker, hero_image, gallery, amenities, starting_price_bdt, lat, lng, featured, status, sort_order)
values
('jolshiri-green-gardens','AHS Jolshiri Green Gardens','Lush low-rise living wrapped in an endemic forest perimeter.','A serene G+4 residential enclave at the heart of Jolshiri Abashon, designed around mature green corridors, water-harvesting landscapes and quiet pedestrian rings.','residential','Jolshiri Abashon, Dhaka','Sector 4, Jolshiri Abashon','Dhaka','Q4 2026','G+4 Residential Scheme','Yalda Sheri',
 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
 array['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'],
 array['Dense endemic forest perimeter','Communal central lap stream pool','Energy-sensitive solar PV panels','Intelligent water harvest tanks','Pedestrian leafy running ring','High-speed fiber connectivity'],
 15500000,23.7805,90.5012,true,'ongoing',1),
('jolshiri-signature-villa','AHS Jolshiri Signature Villa','Bespoke standalone villas with private micro-plunge pools.','A limited collection of architect-designed standalone villas merging art with utility, with triple-height lobbies and European imported kitchen cabinetry.','residential','Jolshiri Abashon, Dhaka','Sector 7, Jolshiri Abashon','Dhaka','Q2 2027','Standalone Villa Scheme','Alexander Sterling',
 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
 array['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80'],
 array['Private micro-plunge pools','Triple-height grand entrance lobby','European imported kitchen cabinetry','Integrated VRF silent cooling systems','Bespoke modern furnishings package','Private security CCTV networks'],
 52000000,23.7822,90.4998,true,'ongoing',2),
('jolshiri-lakeside-sanctuary','Jolshiri Lakeside Sanctuary','Waterfront duplexes with direct lake mooring pontoons.','Lakeside residences offering direct lake recreation docks, private mooring pontoons and lakeside parkway access.','residential','Jolshiri Abashon, Dhaka','Lakeside Boulevard, Jolshiri Abashon','Dhaka','Q3 2026','G+6 Lakeside Scheme','Yalda Sheri',
 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
 array['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80'],
 array['Private lake mooring pontoon','Direct lake recreation docks','Direct lakeside parkway access','Rooftop panorama infinity deck','Double-brick sound insulating walls','Assigned secure parking bays'],
 24000000,23.7790,90.5031,false,'ongoing',3),
('jolshiri-serene-apartments','Jolshiri Serene Apartments','Smart mid-rise apartments steps from Central Park.','Move-in ready smart apartments with generous open floorplan flow and immediate central business corridor walkability.','residential','Jolshiri Abashon, Dhaka','Sector 2, Jolshiri Abashon','Dhaka','Delivered Q1 2026','G+8 Apartment Scheme','Alexander Sterling',
 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
 array['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=80'],
 array['3-minute walk to Jolshiri Central Park','Generous open floorplan flow','Immediate central business corridor walkability','Fully accessorized fitness studio','On-site managed rental desk','High insulation thermal ceiling'],
 13500000,23.7811,90.4985,false,'completed',4),
('jolshiri-central-green-park','Jolshiri Central Green Park Township','A master-planned smart township at the heart of Jolshiri.','AHS flagship master-planned township featuring residential plots, commercial corners and lush central parkland buffers.','township','Jolshiri Abashon, Dhaka','Central District, Jolshiri Abashon','Dhaka','Q4 2028','Master Township Scheme','AHS Township Desk',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
 array['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80'],
 array['Lush green Jolshiri parkland buffers','Fully Cleared Land Mutation Title','RAJUK and Cantonment Approved','Electric cart sharing terminal','Private security and smart entry access','Panoramic open greenfield outlooks'],
 18000000,23.7833,90.5005,true,'upcoming',5),
('cantonment-heights','The Cantonment Heights','Elevated penthouses inside Dhaka Cantonment.','Incomparable city-mountain panoramas from a secured gated estate inside Dhaka Cantonment with access-controlled lift modules.','residential','Dhaka Cantonment','Rajnigandha Tower Area, Dhaka Cantonment','Dhaka','Delivered 2025','G+10 Premium Scheme','Alexander Sterling',
 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
 array['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=80'],
 array['Incomparable city-mountain panoramas','Access controlled lift modules','Secured gated estate parameters','Assigned secure parking bays','Electric automated security shutter gates','Private security and smart entry access'],
 33000000,23.8167,90.3899,false,'completed',6),
('nayapaltan-executive','Nayapaltan Executive Residence','A mixed-use executive tower on VIP Road.','Urban convenience at a premium hub with immediate central business corridor walkability, combining commercial suites and serviced residences.','commercial','Nayapaltan, Dhaka','VIP Road, Nayapaltan, Dhaka','Dhaka','Q1 2027','Mixed-use Tower Scheme','AHS Commercial Desk',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=80',
 array['https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80'],
 array['Urban convenience premium hub','Immediate central business corridor walkability','High-speed fiber connectivity','Underground secure parking','Access controlled lift modules','Walking bypass to local food yards'],
 26000000,23.7389,90.4150,false,'ongoing',7),
('jolshiri-investment-portfolio','Jolshiri High-Yield Investment Portfolio','Off-market high-net-worth advisory and investment pool.','A curated off-market and high-net-worth advisory portfolio for elite capital pools seeking high-yield investment optimization.','investment','Jolshiri Abashon, Dhaka','AHS Estate Desk, Dhaka Cantonment','Dhaka','Rolling','Private Placement Scheme','AHS Advisory Desk',
 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80',
 array['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1600&q=80'],
 array['High-yield investment optimization','Off-Market and High-Net-Worth Advisory','Priority Investment Option Letter','Design Private Placement Consultation','Permanent Residency Support','Built on Integrity and Escrow'],
 22000000,23.7805,90.5012,false,'ongoing',8);

insert into public.units (project_id, name, unit_type, beds, baths, size_sqm, price_bdt, status, sort_order)
select p.id, u.name, u.unit_type, u.beds, u.baths, u.size_sqm, u.price_bdt, u.status, u.sort_order
from public.projects p
join (values
  ('jolshiri-green-gardens','Canopy Garden Duplex','Duplex',3,3,210,21500000::bigint,'Available',1),
  ('jolshiri-green-gardens','Master Signature Villa Pod','Villa',4,4,260,32000000::bigint,'Available',2),
  ('jolshiri-green-gardens','2-Bed Modern Garden Flat','Apartment',2,2,140,15500000::bigint,'Reserved',3),
  ('jolshiri-signature-villa','Signature Villa — Grand','Villa',5,5,420,65000000::bigint,'Available',1),
  ('jolshiri-signature-villa','Signature Villa — Classic','Villa',4,4,360,52000000::bigint,'Reserved',2),
  ('jolshiri-lakeside-sanctuary','Lagoon Signature Duplex with Pool','Duplex',4,4,300,42000000::bigint,'Available',1),
  ('jolshiri-lakeside-sanctuary','Grand River Penthouse with Mooring','Penthouse',4,4,320,39000000::bigint,'Reserved',2),
  ('jolshiri-lakeside-sanctuary','Direct Lakeview Apartment','Apartment',3,3,180,24000000::bigint,'Available',3),
  ('jolshiri-serene-apartments','Signature Luxury Apartment','Apartment',3,3,165,19500000::bigint,'Available',1),
  ('jolshiri-serene-apartments','Skyline Terrace Duplex Suite','Duplex',4,4,240,28000000::bigint,'Available',2),
  ('jolshiri-serene-apartments','2-Bed Serene Flat','Apartment',2,2,120,13500000::bigint,'Sold',3),
  ('jolshiri-central-green-park','Premium Residential Plot','Plot',0,0,250,18000000::bigint,'Available',1),
  ('jolshiri-central-green-park','Commercial Corner Plot','Commercial',0,0,300,35000000::bigint,'Available',2),
  ('cantonment-heights','The Cantonment Heights Penthouse','Penthouse',4,4,350,58000000::bigint,'Reserved',1),
  ('cantonment-heights','Cantonment Sky Residence','Apartment',3,3,200,33000000::bigint,'Available',2),
  ('nayapaltan-executive','Executive Office Suite','Commercial',0,1,150,28000000::bigint,'Available',1),
  ('nayapaltan-executive','Nayapaltan Executive Residence','Apartment',3,3,175,26000000::bigint,'Available',2),
  ('jolshiri-investment-portfolio','Investment Unit Block A','Apartment',3,3,160,22000000::bigint,'Available',1)
) as u(slug, name, unit_type, beds, baths, size_sqm, price_bdt, status, sort_order) on u.slug = p.slug;

insert into public.partners (name, logo_url, category, sort_order) values
('Rajdhani Unnayan Kartripakkha (RAJUK)','https://upload.wikimedia.org/wikipedia/commons/c/c5/Rajdhani_Unnayan_Kartripakkha_Logo.svg','government',1),
('Bangladesh Navy','https://upload.wikimedia.org/wikipedia/commons/e/ee/Bangladesh_Navy_Emblem.svg','government',2),
('Bangladesh Coast Guard','https://upload.wikimedia.org/wikipedia/commons/3/36/Bangladesh_Coast_Guard_Emblem.svg','government',3),
('Mongla Port Authority','https://upload.wikimedia.org/wikipedia/commons/3/30/Mongla_Port_Authority_Logo.svg','government',4),
('Chittagong Port Authority','https://upload.wikimedia.org/wikipedia/commons/b/b2/Chittagong_Port_Authority_Logo.svg','government',5),
('Civil Aviation Authority of Bangladesh','https://upload.wikimedia.org/wikipedia/commons/b/b5/Civil_Aviation_Authority_of_Bangladesh_Logo.svg','government',6),
('Bangladesh Inland Water Transport Authority','https://upload.wikimedia.org/wikipedia/commons/3/39/Bangladesh_Inland_Water_Transport_Authority_Logo.svg','government',7),
('Bangladesh Agricultural Development Corporation','https://upload.wikimedia.org/wikipedia/commons/d/df/BADC_Logo.svg','government',8),
('Military Engineer Services',null,'accreditation',9),
('Department of Public Health Engineering',null,'accreditation',10),
('Directorate General Defence Purchase',null,'accreditation',11),
('EDB Scheme Approved Developer',null,'accreditation',12);

insert into public.faqs (question, answer, category, sort_order) values
('Are AHS developments RAJUK and Cantonment approved?','Yes. Every AHS Properties development is built on approved standards with full RAJUK and Cantonment clearances and a fully cleared land mutation title before any unit is released.','Compliance',1),
('How is my payment protected?','All transactions are structured on an integrity-and-escrow basis. Funds are held against verified construction and title milestones, guaranteeing compliance with national building safety acts.','Payments',2),
('Can non-resident Bangladeshis (NRB) purchase?','Absolutely. We provide off-market and high-net-worth advisory, permanent residency support and remote digital reservation so overseas clients can secure units with full legal insight.','Eligibility',3),
('What is the typical handover timeline?','Timelines vary by scheme and are listed on each development. Completed schemes are move-in ready today, while ongoing schemes publish a target completion quarter on their detail page.','Delivery',4),
('Do you assist with financing and investment planning?','Our dedicated consultants offer high-yield investment optimization, priority investment option letters and private placement consultations tailored to your capital goals.','Investment',5),
('How do I book a private viewing?','Reserve a seat on the Estate Desk Appointment Calendar from the Contact page, or send a pre-reservation request and a senior consultant will arrange a live tour and presentation.','Visits',6);

insert into public.testimonials (name, role, quote, avatar_url, rating, sort_order) values
('Tanvir Ahmed','Investor, Dhaka','AHS handled every approval and the escrow milestones exactly as promised. The most transparent property process I have experienced in Bangladesh.','https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',5,1),
('Farah Karim','NRB Buyer, London','Buying remotely felt risky until AHS walked me through the title documents and arranged a live virtual tour. Faultless from start to handover.','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',5,2),
('Rezaul Hoque','Family Homeowner','Our villa in Green Gardens exceeded expectations — the greenery, the build quality and the after-sales rental desk are genuinely premium.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',5,3);

insert into public.blog_posts (slug, title, excerpt, body, cover_image, author, category, read_minutes, published) values
('why-jolshiri-abashon-elite-capital','Why Jolshiri Abashon is Selected by Elite Capital Pools','A look at the planning, approvals and green infrastructure that make Jolshiri the standout address for discerning Bangladeshi investors.',
 E'Jolshiri Abashon has quietly become the most sought-after planned address in greater Dhaka. Backed by a master plan that prioritises green corridors, water management and controlled density, the area offers something rare in the capital: room to breathe.\nElite capital pools are drawn to three fundamentals — clear titles, regulated approvals and infrastructure that is delivered before it is promised. AHS developments inside Jolshiri are built on fully cleared land mutation titles with RAJUK and Cantonment approvals.\nFor long-horizon investors, the combination of disciplined planning and limited supply is what underpins durable appreciation.',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80','AHS Editorial Desk','Investment',6,true),
('smart-city-housing-schemes-bangladesh','Smart City Housing and Development Schemes in Bangladesh','How smart infrastructure, solar integration and fibre-first design are reshaping the next generation of Bangladeshi townships.',
 E'The phrase smart city is often misused. In practice it means measurable things: solar PV integration, intelligent water harvesting, fibre-first connectivity and access-controlled security woven into the fabric of a development.\nBangladesh is entering a new phase of township design where these systems are specified from day one rather than retrofitted. AHS schemes embed energy-sensitive solar panels, water-harvest tanks and silent VRF cooling as standard.\nThe result is lower running costs, better resilience and a living environment that holds its value as expectations rise.',
 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80','AHS Editorial Desk','Smart City',5,true),
('understanding-land-mutation-title-dhaka','Understanding Land Mutation and Title Clearance in Dhaka','A practical primer on mutation, khatian and the documents that protect buyers in the Dhaka property market.',
 E'Title clearance is the foundation of a safe property purchase. In Bangladesh that means understanding mutation (namjari), up-to-date khatian records and clear chain-of-ownership documentation.\nBefore any AHS unit is released for reservation, the underlying land carries a fully cleared mutation title. We walk every buyer through the document set so there are no surprises at registration.\nThis primer covers what to ask for, how to verify it and why escrow-backed milestones matter.',
 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80','AHS Legal Desk','Legal',7,true),
('keeping-up-with-bangladesh-real-estate-laws','Keeping Up With Bangladesh Real Estate Laws and Guidelines','Stay current with the regulations, guidelines and modern smart-city perspectives shaping property ownership in Bangladesh.',
 E'Regulation in Bangladeshi real estate moves quickly. From RAJUK building rules to cantonment-specific guidelines and evolving NRB ownership pathways, staying current is part of protecting your investment.\nThis ongoing series distils the changes that matter for buyers and investors, with plain-language explanations of what each update means in practice.\nBookmark it and check back as the landscape evolves.',
 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80','AHS Editorial Desk','Insights',4,true);
