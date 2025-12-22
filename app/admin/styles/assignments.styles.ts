// app/admin/styles/assignments.styles.ts
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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightBlue,
    textAlign: 'center',
    opacity: 0.9,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ticketId: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deviceText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  clientText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  assignRow: {
    marginBottom: 16,
  },
  techInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  techLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  techBadge: {
    backgroundColor: colors.softBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  techName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  assignButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  assignButtonIcon: {
    fontSize: 18,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.mediumGray,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center',
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
    maxHeight: '70%',
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
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  techList: {
    maxHeight: 300,
  },
  techOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    gap: 16,
  },
  techAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  techInfoModal: {
    flex: 1,
  },
  techNameModal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  techEmailModal: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  techArrow: {
    fontSize: 20,
    color: colors.lightBlue,
    fontWeight: '300',
  },
  cancelButton: {
    margin: 24,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.mediumGray,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mediumGray,
  },
});