// app/receptionist/styles/create-ticket.styles.ts
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
  orange: '#f59e0b',      // Naranja para warnings
  softBlue: '#e6f2ff',    // Azul muy claro para fondos
};

export default StyleSheet.create({
  container: { 
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: colors.primary,
  },
  headerContent: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightBlue,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  form: {
    paddingHorizontal: 24,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.softBlue,
    position: 'relative',
  },
  sectionBadge: {
    position: 'absolute',
    left: 0,
    bottom: -2,
    width: 40,
    height: 4,
    backgroundColor: colors.lightBlue,
    borderRadius: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  required: {
    color: colors.warning,
    marginLeft: 4,
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderGray,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.dark,
    fontWeight: '500',
  },
  inputFocus: {
    borderColor: colors.lightBlue,
    backgroundColor: colors.softBlue,
  },
  inputLocked: {
    backgroundColor: colors.lightGray,
    borderColor: colors.success,
    borderWidth: 2,
    color: colors.success,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  helperText: {
    fontSize: 13,
    color: colors.success,
    marginTop: 8,
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Estilos de error para validación de cliente
  inputErrorBorder: {
    borderColor: colors.warning,
    borderWidth: 1.6,
  },
  errorText: {
    color: colors.warning,
    fontSize: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGray,
    marginVertical: 32,
    position: 'relative',
  },
  dividerText: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    color: colors.mediumGray,
    fontSize: 12,
    fontWeight: '600',
  },
  textarea: {
    minHeight: 140,
    textAlignVertical: 'top',
    paddingTop: 16,
    lineHeight: 24,
  },
  characterCount: {
    fontSize: 12,
    color: colors.mediumGray,
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 56,
  },
  cancel: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.mediumGray,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mediumGray,
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.3,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  optionalText: {
    fontSize: 12,
    color: colors.mediumGray,
    fontStyle: 'italic',
    marginLeft: 4,
  },
});