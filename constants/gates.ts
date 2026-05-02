// Exit gate data for key Delhi Metro stations
// Tier 1: Full landmark data | Tier 2: Partial | Tier 3: Road only

export interface Gate {
  gate: string
  landmarks: string
  has_lift?: boolean
}

export interface StationGateData {
  gates: Gate[]
  tier: 1 | 2 | 3
}

export const EXIT_GATES: Record<string, StationGateData> = {
  'Rajiv Chowk': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Connaught Place Inner Circle, Palika Bazaar', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Connaught Place, Block A & B, Nirula\'s' },
      { gate: 'Gate 3', landmarks: 'Connaught Place Block C, Super Bazar', has_lift: true },
      { gate: 'Gate 4', landmarks: 'Connaught Place Block D & E, Odeon Cinema' },
      { gate: 'Gate 5', landmarks: 'Connaught Place Block F & G, Regal Cinema' },
      { gate: 'Gate 6', landmarks: 'Connaught Place Block H & I, Plaza Cinema' },
      { gate: 'Gate 7', landmarks: 'Janpath, Tibetan Market, Central Cottage Emporium', has_lift: true },
      { gate: 'Gate 8', landmarks: 'Connaught Place Block L & M, McDonald\'s' },
    ],
  },
  'Kashmere Gate': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Kashmere Gate Bus Terminal (ISBT), UP Roadways', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Old Delhi Railway Station side, Lothian Road' },
      { gate: 'Gate 3', landmarks: 'Kashmere Gate Monument, St. James Church' },
      { gate: 'Gate 4', landmarks: 'Nicholson Cemetery, Magazine Road', has_lift: true },
      { gate: 'Gate 5', landmarks: 'Shyama Prasad Mukherjee Marg, DTC Depot' },
      { gate: 'Gate 6', landmarks: 'Under Bridge, Yamuna Bazaar side' },
      { gate: 'Gate 7', landmarks: 'Ring Road towards Civil Lines', has_lift: true },
      { gate: 'Gate 8', landmarks: 'Mori Gate, Lal Kuan' },
    ],
  },
  'New Delhi': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'New Delhi Railway Station (Paharganj side), Chelmsford Road', has_lift: true },
      { gate: 'Gate 2', landmarks: 'New Delhi Railway Station (Ajmeri Gate side)', has_lift: true },
      { gate: 'Gate 3', landmarks: 'Connaught Place, Scindia House, KG Marg' },
      { gate: 'Gate 4', landmarks: 'Janpath, Ashoka Hotel, Imperial Hotel' },
      { gate: 'Gate 5', landmarks: 'Paharganj Main Bazaar, Budget Hotels' },
    ],
  },
  'Central Secretariat': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'South Block, Prime Minister\'s Office, Vijay Chowk', has_lift: true },
      { gate: 'Gate 2', landmarks: 'North Block, Finance Ministry, Rajpath' },
      { gate: 'Gate 3', landmarks: 'Shastri Bhawan, Nirman Bhawan' },
      { gate: 'Gate 4', landmarks: 'India Gate side, Rajpath lawns', has_lift: true },
    ],
  },
  'Hauz Khas': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Hauz Khas Village, Deer Park, IIT Delhi Gate 1', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Outer Ring Road, Aurobindo Marg, Sri Aurobindo College' },
      { gate: 'Gate 3', landmarks: 'Hauz Khas Market, Hauz Khas Monument & Lake' },
      { gate: 'Gate 4', landmarks: 'IIT Delhi Main Gate, Yusuf Sarai Market', has_lift: true },
    ],
  },
  'AIIMS': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'AIIMS Main Gate, Trauma Centre, Emergency', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Safdarjung Hospital, Ring Road' },
      { gate: 'Gate 3', landmarks: 'AIIMS OPD, Ansari Nagar', has_lift: true },
    ],
  },
  'Saket': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Select Citywalk Mall, DLF South Court', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Saket Court, Press Enclave Road' },
      { gate: 'Gate 3', landmarks: 'MGF Metropolitan Mall, Saket District Centre', has_lift: true },
      { gate: 'Gate 4', landmarks: 'Saket PVR, Leisure Valley Park' },
    ],
  },
  'Chandni Chowk': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Chandni Chowk Main Market, Town Hall', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Fatehpuri Mosque, Khari Baoli Spice Market' },
      { gate: 'Gate 3', landmarks: 'Red Fort (Lal Qila), Digambar Jain Temple' },
      { gate: 'Gate 4', landmarks: 'Sis Ganj Gurudwara, Paranthe Wali Gali', has_lift: true },
    ],
  },
  'Lal Qila': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Red Fort Main Entrance, Netaji Subhash Marg', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Shyama Prasad Mukherjee Marg, Jama Masjid side' },
      { gate: 'Gate 3', landmarks: 'Asaf Ali Road, Delite Cinema' },
    ],
  },
  'Lajpat Nagar': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Lajpat Nagar Central Market, Ring Road', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Lajpat Nagar Market blocks C & D' },
      { gate: 'Gate 3', landmarks: 'Andrews Ganj, South Extension side', has_lift: true },
      { gate: 'Gate 4', landmarks: 'Moolchand Flyover, Defence Colony side' },
    ],
  },
  'Khan Market': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Khan Market Main Shopping Area, Lodhi Colony', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Subramaniam Bharti Marg, Rabindra Nagar' },
      { gate: 'Gate 3', landmarks: 'Lodhi Garden Gate 1, Meher Chand Market' },
    ],
  },
  'Nehru Place': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Nehru Place IT Market, Commercial Complex', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Outer Ring Road, ONGC Building' },
      { gate: 'Gate 3', landmarks: 'Lotus Temple Road, Bahai House of Worship' },
      { gate: 'Gate 4', landmarks: 'Nehru Place Bus Terminal', has_lift: true },
    ],
  },
  'Kalkaji Mandir': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Kalkaji Temple Main Entrance', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Govindpuri Extension, Outer Ring Road' },
      { gate: 'Gate 3', landmarks: 'NSP Complex, Kalkaji Extension' },
    ],
  },
  'Indira Gandhi International Airport': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Terminal 3 Departures & Arrivals, Cab Stand', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Terminal 3 Car Park, Hotel Zone' },
    ],
  },
  'Delhi Aerocity': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Aerocity Hotels (Novotel, Ibis, Pullman), NH-48', has_lift: true },
      { gate: 'Gate 2', landmarks: 'HMR Convention Centre, Aerocity Business District' },
    ],
  },
  'Janpath': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Janpath Market, Tibetan Market, Windsor Place', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Tolstoy Marg, Statesman House' },
    ],
  },
  'Mandi House': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Mandi House, National School of Drama', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Copernicus Marg, Shri Ram Centre' },
      { gate: 'Gate 3', landmarks: 'Tansen Marg, Doordarshan Bhawan, Ficci Auditorium' },
    ],
  },
  'ITO': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Income Tax Office, Vikas Marg', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Delhi Police Headquarters, IP Estate' },
      { gate: 'Gate 3', landmarks: 'Bahadur Shah Zafar Marg, Press Colony, HT House' },
      { gate: 'Gate 4', landmarks: 'Mata Sundari Road, Delhi High Court side', has_lift: true },
    ],
  },
  'Karol Bagh': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Ajmal Khan Road, Karol Bagh Main Market', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Pusa Road, WEA Market' },
      { gate: 'Gate 3', landmarks: 'Bank Street, Arya Samaj Road, Hotel zone' },
      { gate: 'Gate 4', landmarks: 'Karol Bagh Tank Road', has_lift: true },
    ],
  },
  'Rajouri Garden': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Rajouri Garden Main Market, Ring Road', has_lift: true },
      { gate: 'Gate 2', landmarks: 'TDI Mall, Vishal Enclave' },
      { gate: 'Gate 3', landmarks: 'Madipur, Rajouri Garden Residential' },
    ],
  },
  'Anand Vihar': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Anand Vihar ISBT (Bus Terminal), UP Roadways', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Anand Vihar Railway Station, Kaushambi side' },
      { gate: 'Gate 3', landmarks: 'Anand Vihar Residential, Vivek Vihar road' },
    ],
  },
  'Akshardham': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Akshardham Temple Main Entrance, NH-24', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Mayur Vihar Phase 1, Pandav Nagar side' },
    ],
  },
  'Qutab Minar': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Qutab Minar ASI Complex, Mehrauli', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Aurobindo Marg, Anuvrat Marg' },
    ],
  },
  'Netaji Subhash Place': {
    tier: 1,
    gates: [
      { gate: 'Gate 1', landmarks: 'Netaji Subhash Place Commercial Complex, Outer Ring Road', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Wazirpur Industrial Area, GTK Road' },
      { gate: 'Gate 3', landmarks: 'Shakurpur, Pitampura side' },
    ],
  },
  'Vaishali': {
    tier: 2,
    gates: [
      { gate: 'Gate 1', landmarks: 'Vaishali Sector 4 & 5, NH-24 Bus Stop', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Vaishali Sector 1, 2 & 3' },
    ],
  },
  'Noida City Centre': {
    tier: 2,
    gates: [
      { gate: 'Gate 1', landmarks: 'Sector 32 Market, The Grand Venice Mall area', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Sector 31, DND Flyway side' },
    ],
  },
  'Botanical Garden': {
    tier: 2,
    gates: [
      { gate: 'Gate 1', landmarks: 'Botanical Garden Noida, Sector 38A', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Sector 37, Expressway side' },
    ],
  },
  'Dwarka Sector 21': {
    tier: 2,
    gates: [
      { gate: 'Gate 1', landmarks: 'Dwarka Sector 21 Market, Airport Express connection', has_lift: true },
      { gate: 'Gate 2', landmarks: 'Sector 21 Residential, Palam Vihar side' },
    ],
  },
}