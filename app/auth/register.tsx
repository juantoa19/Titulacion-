import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
// 1. Importar el tipo RegisterData
import { useAuth, RegisterData } from '../context/_AuthContext'; 
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // 2. CAMBIADO: 'name' a 'nombre1' para que coincida con el formulario
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  // 3. ELIMINADO: 'selectedRole'
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    // 4. CAMBIADO: 'name' a 'nombre1'
    nombre1: false,
    nombre2: false,
    apellido1: false,
    apellido2: false,
    cedula: false,
    telefono: false,
    email: false,
    password: false,
    confirmPassword: false,
    direccion: false
  });
  
  const { register } = useAuth();

  // Animaciones (sin cambios)
  const titleAnim = React.useRef(new Animated.Value(0)).current;
  const formAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 20,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        tension: 20,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleRegister = async () => {
    // 5. CORREGIDO: Comprobar campos obligatorios correctos
    if (!email || !password || !confirmPassword || !nombre1 || !apellido1 || !cedula || !telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (*)');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // 6. CORREGIDO: Mínimo 8 caracteres para coincidir con Laravel
    if (password.length < 8) { 
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    
    // 7. CORREGIDO: Construir el objeto formData completo
    const formData: RegisterData = {
      name: nombre1,
      nombre2: nombre2 || null,
      apellido1: apellido1,
      apellido2: apellido2 || null,
      cedula: cedula,
      telefono: telefono,
      direccion: direccion || null,
      email: email,
      password: password,
      password_confirmation: confirmPassword
    };

    try {
      await register(formData); // Enviar el objeto completo
      Alert.alert(
        '¡Cuenta creada!', 
        'Tu cuenta ha sido creada exitosamente. Serás redirigido al Login.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login')
          }
        ]
      );
    } catch (error: any) {
      // 8. CORREGIDO: Manejo de error de validación (firstError: unknown)
      if (error.response && error.response.data && error.response.data.errors) {
        // 'errors' es { email: ["El email..."], password: [...] }
        const errors: Record<string, string[]> = error.response.data.errors;
        const errorMessages = Object.values(errors);
        
        if (errorMessages.length > 0) {
          const firstErrorMessages = errorMessages[0];
          if (firstErrorMessages.length > 0) {
            Alert.alert('Error de Validación', firstErrorMessages[0]);
          }
        } else {
          Alert.alert('Error', 'Ocurrió un error de validación.');
        }
      } else {
        Alert.alert('Error', error.message || 'Error al crear la cuenta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const titleScale = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0]
  });

  // 9. CORREGIDO: 'isFormValid' usa los campos correctos
  const isFormValid = email && password && confirmPassword && nombre1 && apellido1 && cedula && telefono && password === confirmPassword && password.length >= 8;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            {/* Header */}
            <View style={styles.header}>
              <Animated.Text 
                style={[
                  styles.title,
                  {
                    transform: [{ scale: titleScale }]
                  }
                ]}
              >
                Crear Cuenta
              </Animated.Text>
              <Text style={styles.subtitle}>
                Regístrate para comenzar
              </Text>
            </View>

            <Animated.View 
              style={[
                styles.formContainer,
                {
                  transform: [{ translateY: formTranslateY }]
                }
              ]}
            >

              {/* Información Personal */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionLabel}>Información Personal</Text>
              </View>

              {/* Nombres */}
              <View style={styles.rowContainer}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Primer Nombre *</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      isFocused.nombre1 && styles.inputFocused,
                      nombre1 && styles.inputValid
                    ]}
                    placeholder="Primer nombre"
                    value={nombre1}
                    onChangeText={setNombre1} // 10. CORREGIDO
                    onFocus={() => handleFocus('nombre1')}
                    onBlur={() => handleBlur('nombre1')}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Segundo Nombre</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      isFocused.nombre2 && styles.inputFocused,
                      nombre2 && styles.inputValid
                    ]}
                    placeholder="Segundo nombre"
                    value={nombre2}
                    onChangeText={setNombre2}
                    onFocus={() => handleFocus('nombre2')}
                    onBlur={() => handleBlur('nombre2')}
                  />
                </View>
              </View>

              {/* Apellidos */}
              <View style={styles.rowContainer}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Primer Apellido *</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      isFocused.apellido1 && styles.inputFocused,
                      apellido1 && styles.inputValid
                    ]}
                    placeholder="Primer apellido"
                    value={apellido1}
                    onChangeText={setApellido1}
                    onFocus={() => handleFocus('apellido1')}
                    onBlur={() => handleBlur('apellido1')}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Segundo Apellido</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      isFocused.apellido2 && styles.inputFocused,
                      apellido2 && styles.inputValid
                    ]}
                    placeholder="Segundo apellido"
                    value={apellido2}
                    onChangeText={setApellido2}
                    onFocus={() => handleFocus('apellido2')}
                    onBlur={() => handleBlur('apellido2')}
                  />
                </View>
              </View>

              {/* Cédula y Teléfono */}
              <View style={styles.rowContainer}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Cédula *</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      isFocused.cedula && styles.inputFocused,
                      cedula && styles.inputValid
                    ]}
                    placeholder="Número de cédula"
                    value={cedula}
                    onChangeText={setCedula}
                    keyboardType="numeric"
                    onFocus={() => handleFocus('cedula')}
                    onBlur={() => handleBlur('cedula')}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Teléfono *</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      isFocused.telefono && styles.inputFocused,
                      telefono && styles.inputValid
                    ]}
                    placeholder="Teléfono"
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                    onFocus={() => handleFocus('telefono')}
                    onBlur={() => handleBlur('telefono')}
                  />
                </View>
              </View>

              {/* Dirección */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Dirección (Opcional)</Text>
                <TextInput 
                  style={[
                    styles.input,
                    isFocused.direccion && styles.inputFocused,
                    direccion && styles.inputValid
                  ]}
                  placeholder="Tu dirección completa"
                  value={direccion}
                  onChangeText={setDireccion}
                  onFocus={() => handleFocus('direccion')}
                  onBlur={() => handleBlur('direccion')}
                />
              </View>

              {/* Separador */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionLabel}>Información de Cuenta</Text>
              </View>

              {/* Input de Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Correo electrónico *</Text>
                <TextInput 
                  style={[
                    styles.input,
                    isFocused.email && styles.inputFocused,
                    email && styles.inputValid
                  ]}
                  placeholder="tu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                />
              </View>

              {/* Input de Contraseña */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contraseña *</Text>
                <TextInput 
                  style={[
                    styles.input,
                    isFocused.password && styles.inputFocused,
                    password && password.length >= 8 && styles.inputValid,
                    password && password.length < 8 && styles.inputError
                  ]}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                />
                {password && password.length < 8 && (
                  <Text style={styles.errorText}>Mínimo 8 caracteres</Text>
                )}
              </View>

              {/* Input de Confirmar Contraseña */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirmar Contraseña *</Text>
                <TextInput 
                  style={[
                    styles.input,
                    isFocused.confirmPassword && styles.inputFocused,
                    confirmPassword && password === confirmPassword && styles.inputValid,
                    confirmPassword && password !== confirmPassword && styles.inputError
                  ]}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                />
                {confirmPassword && password !== confirmPassword && (
                  <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
                )}
              </View>

              {/* Requisitos de contraseña */}
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>La contraseña debe:</Text>
                <Text style={[
                  styles.requirementText,
                  password.length >= 8 ? styles.requirementMet : styles.requirementUnmet
                ]}>
                  ✓ Tener al menos 8 caracteres
                </Text>
                <Text style={[
                  styles.requirementText,
                  password === confirmPassword && confirmPassword ? styles.requirementMet : styles.requirementUnmet
                ]}>
                  ✓ Coincidir con la confirmación
                </Text>
              </View>

              {/* 11. ELIMINADO: Selector de Rol */}

              {/* Botón de Registro */}
              <TouchableOpacity 
                style={[
                  styles.button,
                  (!isFormValid || loading) && styles.buttonDisabled
                ]} 
                onPress={handleRegister} 
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Crear Cuenta</Text>
                )}
              </TouchableOpacity>

              {/* Link de login */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Inicia Sesión</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// 12. CORREGIDO: Eliminados los estilos del selector de rol
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#0f172a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  inputValid: {
    borderColor: '#10b981',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordRequirements: {
    marginTop: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 11,
    marginBottom: 2,
  },
  requirementMet: {
    color: '#10b981',
  },
  requirementUnmet: {
    color: '#94a3b8',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#64748b',
    fontSize: 14,
  },
  loginLink: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
});