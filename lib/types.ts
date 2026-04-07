export interface Job {
  id: string
  jobReference: string
  vehicleRegistration: string
  vehicleMake: string
  vehicleModel: string
  vehicleColor: string
  chassisNumber: string
  requiredDeliveryDate: string
  
  // Collection details
  collectionAddress: string
  collectionPostcode: string
  collectionTelephone: string
  collectionTelephone2?: string
  collectionName: string
  
  // Delivery details
  deliveryAddress: string
  deliveryPostcode: string
  deliveryTelephone: string
  deliveryTelephone2?: string
  deliveryName: string
  
  // Notes
  specialNotes?: string
  jobProviderNotes?: string
  
  // Form status
  collectionFormStatus: 'new' | 'in-progress' | 'sent'
  deliveryFormStatus: 'new' | 'in-progress' | 'sent'
  
  createdAt: string
  updatedAt: string
}

export interface FormData {
  id?: string
  jobId: string
  formType: 'collection' | 'delivery'
  status: 'new' | 'in-progress' | 'sent'
  
  // Step 1: Basic vehicle info
  mileage: string
  fuel: string
  charge: string
  numberOfKeys: string
  vehicleDeliveryPack: boolean | null
  lockingWheelNut: boolean | null
  numberPlatesMatch: boolean | null
  warningLightsOn: boolean | null
  satNavWorking: boolean | null
  
  // Step 2: Equipment checks
  headrestsPresent: boolean | null
  parcelShelfPresent: boolean | null
  spareWheelPresent: boolean | null
  jackPresent: boolean | null
  toolsPresent: boolean | null
  chargingCablesPresent: boolean | null
  numberOfChargingCables?: string
  v5DocumentPresent: boolean | null
  light: string
  weather: string
  notes?: string
  
  // Step 3-7: Photo confirmations
  photoLeftSide: boolean | null
  photoRightSide: boolean | null
  photoFront: boolean | null
  photoBack: boolean | null
  photoDashboard: boolean | null
  photoKeys: boolean | null
  photoNumberPlates: boolean | null
  
  // Photo URLs (uploaded to Cloudinary)
  photoUrls: {
    leftSide?: string
    rightSide?: string
    front?: string
    back?: string
    dashboard?: string
    keys?: string
    numberPlates?: string
  }
  
  // Step 8: Summary confirmation
  agreedWithInfo: boolean | null
  
  // Step 9: Customer signature
  customerName: string
  customerCompany: string
  customerShownDetails: boolean | null
  signingOnBehalf: boolean | null
  signedForBy?: string
  customerSignature: string
  customerSignatureTimestamp?: string
  
  // Step 10: Handover prompt (no data needed)
  
  // Step 11: Driver signature
  driverName: string
  driverSignature: string
  driverSignatureTimestamp?: string
  estimatedArrivalDate?: string
  estimatedArrivalTime?: string
  agentNotes?: string
  
  // Metadata
  driverId: string
  createdAt: string
  updatedAt: string
  submittedAt?: string
}

export const DEFAULT_FORM_DATA: Omit<FormData, 'id' | 'jobId' | 'formType' | 'driverId' | 'createdAt' | 'updatedAt'> = {
  status: 'new',
  mileage: '',
  fuel: '',
  charge: '',
  numberOfKeys: '',
  vehicleDeliveryPack: null,
  lockingWheelNut: null,
  numberPlatesMatch: null,
  warningLightsOn: null,
  satNavWorking: null,
  headrestsPresent: null,
  parcelShelfPresent: null,
  spareWheelPresent: null,
  jackPresent: null,
  toolsPresent: null,
  chargingCablesPresent: null,
  numberOfChargingCables: '',
  v5DocumentPresent: null,
  light: '',
  weather: '',
  notes: '',
  photoLeftSide: null,
  photoRightSide: null,
  photoFront: null,
  photoBack: null,
  photoDashboard: null,
  photoKeys: null,
  photoNumberPlates: null,
  photoUrls: {},
  agreedWithInfo: null,
  customerName: '',
  customerCompany: '',
  customerShownDetails: null,
  signingOnBehalf: null,
  signedForBy: '',
  customerSignature: '',
  customerSignatureTimestamp: '',
  driverName: '',
  driverSignature: '',
  driverSignatureTimestamp: '',
  estimatedArrivalDate: '',
  estimatedArrivalTime: '',
  agentNotes: '',
}
