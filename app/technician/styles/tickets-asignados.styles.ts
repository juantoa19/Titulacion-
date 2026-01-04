// app/technician/styles/tickets-asignados.styles.ts
import { StyleSheet } from 'react-native';

const colors = {
  primary: '#10518b',     // Azul principal
  dark: '#343433',        // Gris oscuro
  white: '#ffffff',       // Blanco
  lightBlue: '#5faee3',   // Azul claro
  background: '#f8fafc',  // Fondo claro
  lightGray: '#f1f5f9',   // Gris muy claro
  mediumGray: '#94a3b8',  // Gris medio
  borderGray: '#e2e8f0',  // Gris para bordes
  textLight: '#64748b',   // Texto claro
  success: '#10b981',     // Verde éxito
  warning: '#ef4444',     // Rojo error
  orange: '#f59e0b',      // Naranja
  softBlue: '#e6f2ff',    // Azul muy claro
  purple: '#8b5cf6',      // Morado para extras
};

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 100,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.lightBlue,
    textAlign: 'center',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
    color: colors.dark,
  },
  deviceText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 6,
  },
  userText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  problemText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  dateText: {
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '500',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  assignedBadge: {
    backgroundColor: colors.softBlue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  assignedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    maxHeight: '80%',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 20,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.softBlue,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  problemBox: {
    backgroundColor: colors.softBlue,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.lightBlue,
  },
  problemDetailText: {
    fontSize: 15,
    color: colors.dark,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  stateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  stateButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'capitalize',
  },
  stateButtonTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  closingFieldsContainer: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.success + '30',
  },
  revisionFieldsContainer: {
    backgroundColor: '#fffbeb', // Fondo ámbar muy claro
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f59e0b' + '30', // Naranja con opacidad
  },
  revisionHelperText: {
    fontSize: 14,
    color: '#d97706', // Naranja oscuro
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  helperText: {
    fontSize: 14,
    color: colors.success,
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.dark,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
    lineHeight: 20,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  saldoContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  saldoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  saldoValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  priorityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'capitalize',
  },
  priorityButtonTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  technicianLabel: {
    fontSize: 14,
    color: colors.mediumGray,
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.mediumGray,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mediumGray,
  },
  saveButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});