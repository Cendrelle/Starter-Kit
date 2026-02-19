import { create } from 'zustand'

// 1. On définit la structure des données (plus de "any" !)
interface CandidateData {
  nom?: string;
  prenom?: string;
  email?: string;
  diplome?: string;
  motivation?: string;
}

// 2. On définit la structure du Store
interface FormState {
  step: number;
  formData: CandidateData;
  setStep: (step: number) => void;
  updateFormData: (data: CandidateData) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// 3. On crée le store avec les fonctions de navigation
export const useFormStore = create<FormState>((set) => ({
  step: 1,
  formData: {},
  setStep: (step) => set({ step }),
  updateFormData: (data) => 
    set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
}))