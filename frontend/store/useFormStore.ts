import { create } from 'zustand'

interface FormState {
  step: number
  formData: any
  setStep: (step: number) => void
  updateFormData: (data: any) => void
}

export const useFormStore = create<FormState>((set) => ({
  step: 1,
  formData: {},
  setStep: (step) => set({ step }),
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
}))