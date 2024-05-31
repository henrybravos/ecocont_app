import { EnumDocumentType } from '@core/types/customer'

const DocumentTypeLabels = [
  { value: EnumDocumentType.DNI, label: 'DNI', fullLabel: 'Documento Nacional de Identidad' },
  { value: EnumDocumentType.RUC, label: 'RUC', fullLabel: 'Registro Único de Contribuyentes' },
  { value: EnumDocumentType.PASSPORT, label: 'PASAPORTE', fullLabel: 'Pasaporte' },
  {
    value: EnumDocumentType.DIPLOMATIC_IDENTITY_CARD,
    label: 'CED. DIP.',
    fullLabel: 'Cédula Diplomática',
  },
  {
    value: EnumDocumentType.FOREIGNER_IDENTITY_CARD,
    label: 'CAR. EXT.',
    fullLabel: 'Carné de Extranjería',
  },
  { value: EnumDocumentType.OTHERS, label: 'otros', fullLabel: 'Otros' },
]
export { DocumentTypeLabels }
