// app/admin/styles/reports.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#10518b',     // Azul principal (para botón consultar)
  dark: '#343433',        // Gris oscuro
  white: '#ffffff',       // Blanco
  lightBlue: '#5faee3',   // Azul claro
  success: '#3bb273',     // Verde para botón descargar (tu solicitud)
  background: '#f8fafc',  // Fondo claro
  lightGray: '#f1f5f9',   // Gris muy claro
  mediumGray: '#94a3b8',  // Gris medio
  borderGray: '#e2e8f0',  // Gris para bordes
  textLight: '#64748b',   // Texto claro
  warning: '#f59e0b',     // Amarillo/naranja
};

export default StyleSheet.create({
  container: { 
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: colors.white, 
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: { 
    fontSize: 16, 
    color: colors.lightBlue, 
    opacity: 0.9,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 16,
  },
  filterBox: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateSeparator: {
    marginHorizontal: 12,
    marginTop: 24,
  },
  dateSeparatorText: {
    fontSize: 16,
    color: colors.mediumGray,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderWidth: 1.5,
    borderColor: colors.borderGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: colors.mediumGray,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
    height: '100%',
  },
  chipsScroll: {
    marginHorizontal: -4,
  },
  chipsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.borderGray,
    minHeight: 44,
  },
  chipSelected: {
    backgroundColor: colors.primary + '15', // 15% opacity
    borderColor: colors.primary,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  statsButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 24,
    gap: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statsButtonIcon: {
    fontSize: 20,
  },
  statsButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.3,
  },
  statsContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
    flex: 1,
  },
  dateBadge: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.lightGray,
    flex: 1,
    minWidth: (width - 64) / 2 - 6,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    alignItems: 'center',
  },
  statCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 4,
  },
  statCardSubtext: {
    fontSize: 11,
    color: colors.mediumGray,
    fontWeight: '500',
    textAlign: 'center',
  },
  downloadSection: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  downloadDescription: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
    marginBottom: 24,
  },
  pdfButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  pdfButtonDisabled: {
    opacity: 0.7,
  },
  pdfButtonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pdfButtonIcon: {
    fontSize: 24,
    color: colors.white,
  },
  pdfButtonTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  pdfButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  pdfButtonSubtext: {
    fontSize: 13,
    color: colors.white + 'CC', // 80% opacity
    marginTop: 2,
    fontWeight: '500',
  },
  pdfButtonArrow: {
    fontSize: 24,
    color: colors.white,
    fontWeight: '300',
    opacity: 0.9,
  },
});