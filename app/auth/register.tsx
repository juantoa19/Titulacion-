import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import registerStyles from './styles/register.styles';
import { useAuth, RegisterData } from '../context/_AuthContext'; 
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
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

  // Animaciones avanzadas
  const titleAnim = React.useRef(new Animated.Value(0)).current;
  const formAnim = React.useRef(new Animated.Value(0)).current;
  const logoRotate = React.useRef(new Animated.Value(0)).current;
  const buttonShineAnim = React.useRef(new Animated.Value(0)).current;
  const floatingAnim1 = React.useRef(new Animated.Value(0)).current;
  const floatingAnim2 = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del logo giratorio
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 25000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación del brillo del botón
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonShineAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animaciones flotantes
    Animated.parallel([
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.spring(floatingAnim1, {
        toValue: 1,
        tension: 45,
        friction: 6,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(floatingAnim2, {
        toValue: 1,
        tension: 45,
        friction: 6,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Función para inputs numéricos
  const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setter(numericValue);
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !nombre1 || !apellido1 || !cedula || !telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios (*)');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) { 
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (cedula.length !== 10 || telefono.length !== 10) {
      Alert.alert('Error de Formato', 'La cédula y el teléfono deben tener 10 dígitos.');
      return;
    }

    setLoading(true);
    
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
      await register(formData);
      Alert.alert(
        '🎉 ¡Cuenta Creada!', 
        'Tu cuenta ha sido creada exitosamente. Redirigiendo al Login...',
        [
          {
            text: 'Continuar',
            onPress: () => router.replace('/auth/login')
          }
        ]
      );
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
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
    outputRange: [0.7, 1]
  });

  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const buttonShinePosition = buttonShineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100]
  });

  const floatingTranslateY1 = floatingAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0]
  });

  const floatingTranslateY2 = floatingAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  // Calcular progreso del formulario
  const personalInfoComplete = nombre1 && apellido1 && cedula && telefono;
  const accountInfoComplete = email && password && confirmPassword && password.length >= 8 && password === confirmPassword;
  const progress = (personalInfoComplete ? 50 : 25) + (accountInfoComplete ? 50 : 25);

  const isFormValid = email && password && confirmPassword && nombre1 && apellido1 && cedula && telefono && password === confirmPassword && password.length >= 8;

  return (
    <KeyboardAvoidingView 
      style={registerStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc', '#e0f7ff']}
        style={registerStyles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Elementos flotantes animados */}
      <View style={registerStyles.floatingElements}>
        <Animated.View 
          style={[
            registerStyles.floatingShape1,
            { transform: [{ translateY: floatingTranslateY1 }] }
          ]} 
        />
        <Animated.View 
          style={[
            registerStyles.floatingShape2,
            { transform: [{ translateY: floatingTranslateY2 }] }
          ]} 
        />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={registerStyles.scrollView}
          contentContainerStyle={registerStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={registerStyles.inner}>
            {/* Header */}
            <View style={registerStyles.header}>
              {/* Logo animado giratorio */}
              <Animated.View 
                style={[
                  registerStyles.logoContainer,
                  { transform: [{ rotate: logoRotation }] }
                ]}
              >
                <View style={registerStyles.logoInner}>
                  <Ionicons name="person-add" size={32} color="#ffffff" style={{ transform: [{ rotate: '-45deg' }] }} />
                </View>
              </Animated.View>

              <Animated.Text
                style={[
                  registerStyles.title,
                  { 
                    transform: [{ scale: titleScale }],
                    opacity: titleAnim 
                  }
                ]}
              >
                Únete a Nosotros
              </Animated.Text>
              <Text style={registerStyles.subtitle}>
                Crea tu cuenta y comienza tu experiencia
              </Text>
            </View>

            {/* Indicador de progreso */}
            <View style={registerStyles.progressContainer}>
              <View style={[
                registerStyles.stepIndicator,
                nombre1 && apellido1 ? registerStyles.stepIndicatorCompleted : registerStyles.stepIndicatorActive
              ]}>
                <Text style={registerStyles.stepNumber}>1</Text>
              </View>
              <View style={[
                registerStyles.progressStep,
                nombre1 && apellido1 ? registerStyles.progressStepCompleted : registerStyles.progressStepActive
              ]} />
              <View style={[
                registerStyles.stepIndicator,
                accountInfoComplete ? registerStyles.stepIndicatorCompleted : 
                (personalInfoComplete ? registerStyles.stepIndicatorActive : {})
              ]}>
                <Text style={registerStyles.stepNumber}>2</Text>
              </View>
              <View style={[
                registerStyles.progressStep,
                accountInfoComplete ? registerStyles.progressStepCompleted : 
                (personalInfoComplete ? registerStyles.progressStepActive : {})
              ]} />
              <View style={[
                registerStyles.stepIndicator,
                isFormValid ? registerStyles.stepIndicatorCompleted : 
                (accountInfoComplete ? registerStyles.stepIndicatorActive : {})
              ]}>
                <Text style={registerStyles.stepNumber}>3</Text>
              </View>
            </View>

            <Animated.View 
              style={[
                registerStyles.formContainer,
                { 
                  transform: [{ translateY: formTranslateY }],
                  opacity: formAnim 
                }
              ]}
            >

              {/* Información Personal */}
              <View style={registerStyles.sectionTitle}>
                <Text style={registerStyles.sectionLabel}>
                  <Ionicons name="person-circle-outline" size={20} color="#10518b" /> 
                  {' '}Información Personal
                </Text>
              </View>

              {/* Nombres */}
              <View style={registerStyles.rowContainer}>
                <View style={registerStyles.halfInput}>
                  <Text style={registerStyles.inputLabel}>
                    <Ionicons name="person" size={16} color="#10518b" /> 
                    {' '}Primer Nombre<Text style={registerStyles.requiredStar}> *</Text>
                  </Text>
                  <View style={registerStyles.inputIconContainer}>
                    <Ionicons name="person" size={22} color="#5faeee" />
                  </View>
                  <TextInput 
                    style={[
                      registerStyles.input,
                      isFocused.nombre1 && registerStyles.inputFocused,
                      nombre1 && registerStyles.inputValid
                    ]}
                    placeholder=""
                    placeholderTextColor="#94a3b8"
                    value={nombre1}
                    onChangeText={setNombre1}
                    onFocus={() => handleFocus('nombre1')}
                    onBlur={() => handleBlur('nombre1')}
                    maxLength={50}
                    editable={!loading}
                  />
                </View>
                <View style={registerStyles.halfInput}>
                  <Text style={registerStyles.inputLabel}>
                    Segundo Nombre
                  </Text>
                  <View style={registerStyles.inputIconContainer}>
                    <Ionicons name="person-outline" size={22} color="#94a3b8" />
                  </View>
                  <TextInput 
                    style={[
                      registerStyles.input,
                      isFocused.nombre2 && registerStyles.inputFocused,
                      nombre2 && registerStyles.inputValid
                    ]}
                    placeholder=""
                    placeholderTextColor="#94a3b8"
                    value={nombre2}
                    onChangeText={setNombre2}
                    onFocus={() => handleFocus('nombre2')}
                    onBlur={() => handleBlur('nombre2')}
                    maxLength={50}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Apellidos */}
              <View style={registerStyles.rowContainer}>
                <View style={registerStyles.halfInput}>
                  <Text style={registerStyles.inputLabel}>
                    <Ionicons name="people" size={16} color="#10518b" /> 
                    {' '}Primer Apellido<Text style={registerStyles.requiredStar}> *</Text>
                  </Text>
                  <View style={registerStyles.inputIconContainer}>
                    <Ionicons name="people" size={22} color="#5faeee" />
                  </View>
                  <TextInput 
                    style={[
                      registerStyles.input,
                      isFocused.apellido1 && registerStyles.inputFocused,
                      apellido1 && registerStyles.inputValid
                    ]}
                    placeholder=""
                    placeholderTextColor="#94a3b8"
                    value={apellido1}
                    onChangeText={setApellido1}
                    onFocus={() => handleFocus('apellido1')}
                    onBlur={() => handleBlur('apellido1')}
                    maxLength={50}
                    editable={!loading}
                  />
                </View>
                <View style={registerStyles.halfInput}>
                  <Text style={registerStyles.inputLabel}>
                    Segundo Apellido
                  </Text>
                  <View style={registerStyles.inputIconContainer}>
                    <Ionicons name="people-outline" size={22} color="#94a3b8" />
                  </View>
                  <TextInput 
                    style={[
                      registerStyles.input,
                      isFocused.apellido2 && registerStyles.inputFocused,
                      apellido2 && registerStyles.inputValid
                    ]}
                    placeholder=""
                    placeholderTextColor="#94a3b8"
                    value={apellido2}
                    onChangeText={setApellido2}
                    onFocus={() => handleFocus('apellido2')}
                    onBlur={() => handleBlur('apellido2')}
                    maxLength={50}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Cédula y Teléfono */}
              <View style={registerStyles.rowContainer}>
                <View style={registerStyles.halfInput}>
                  <Text style={registerStyles.inputLabel}>
                    <Ionicons name="card" size={16} color="#10518b" /> 
                    {' '}Cédula<Text style={registerStyles.requiredStar}> *</Text>
                  </Text>
                  <View style={registerStyles.inputIconContainer}>
                    <Ionicons name="card" size={22} color="#5faeee" />
                  </View>
                  <TextInput 
                    style={[
                      registerStyles.input,
                      isFocused.cedula && registerStyles.inputFocused,
                      cedula && cedula.length === 10 ? registerStyles.inputValid : 
                      cedula ? registerStyles.inputError : {}
                    ]}
                    placeholder=""
                    placeholderTextColor="#94a3b8"
                    value={cedula}
                    onChangeText={(text) => handleNumericChange(setCedula, text)}
                    keyboardType="numeric"
                    onFocus={() => handleFocus('cedula')}
                    onBlur={() => handleBlur('cedula')}
                    maxLength={10}
                    editable={!loading}
                  />
                  {cedula && cedula.length !== 10 && (
                    <Text style={registerStyles.errorText}>Debe tener 10 dígitos</Text>
                  )}
                </View>
                <View style={registerStyles.halfInput}>
                  <Text style={registerStyles.inputLabel}>
                    <Ionicons name="call" size={16} color="#10518b" /> 
                    {' '}Teléfono<Text style={registerStyles.requiredStar}> *</Text>
                  </Text>
                  <View style={registerStyles.inputIconContainer}>
                    <Ionicons name="call" size={22} color="#5faeee" />
                  </View>
                  <TextInput 
                    style={[
                      registerStyles.input,
                      isFocused.telefono && registerStyles.inputFocused,
                      telefono && telefono.length === 10 ? registerStyles.inputValid : 
                      telefono ? registerStyles.inputError : {}
                    ]}
                    placeholder=""
                    placeholderTextColor="#94a3b8"
                    value={telefono}
                    onChangeText={(text) => handleNumericChange(setTelefono, text)}
                    keyboardType="phone-pad"
                    onFocus={() => handleFocus('telefono')}
                    onBlur={() => handleBlur('telefono')}
                    maxLength={10}
                    editable={!loading}
                  />
                  {telefono && telefono.length !== 10 && (
                    <Text style={registerStyles.errorText}>Debe tener 10 dígitos</Text>
                  )}
                </View>
              </View>

              {/* Dirección */}
              <View style={registerStyles.inputContainer}>
                <Text style={registerStyles.inputLabel}>
                  <Ionicons name="location" size={16} color="#10518b" /> 
                  {' '}Dirección (Opcional)
                </Text>
                <View style={registerStyles.inputIconContainer}>
                  <Ionicons name="location-outline" size={22} color="#94a3b8" />
                </View>
                <TextInput 
                  style={[
                    registerStyles.input,
                    isFocused.direccion && registerStyles.inputFocused,
                    direccion && registerStyles.inputValid
                  ]}
                  placeholder=""
                  placeholderTextColor="#94a3b8"
                  value={direccion}
                  onChangeText={setDireccion}
                  onFocus={() => handleFocus('direccion')}
                  onBlur={() => handleBlur('direccion')}
                  maxLength={255}
                  editable={!loading}
                />
              </View>

              {/* Separador */}
              <View style={registerStyles.sectionTitle}>
                <Text style={registerStyles.sectionLabel}>
                  <Ionicons name="lock-closed" size={20} color="#10518b" /> 
                  {' '}Información de Cuenta
                </Text>
              </View>

              {/* Input de Email */}
              <View style={registerStyles.inputContainer}>
                <Text style={registerStyles.inputLabel}>
                  <Ionicons name="mail" size={16} color="#10518b" /> 
                  {' '}Correo electrónico<Text style={registerStyles.requiredStar}> *</Text>
                </Text>
                <View style={registerStyles.inputIconContainer}>
                  <Ionicons name="mail" size={22} color="#5faeee" />
                </View>
                <TextInput 
                  style={[
                    registerStyles.input,
                    isFocused.email && registerStyles.inputFocused,
                    email && registerStyles.inputValid
                  ]}
                  placeholder=""
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  maxLength={254}
                  editable={!loading}
                />
              </View>

              {/* Input de Contraseña */}
              <View style={registerStyles.inputContainer}>
                <Text style={registerStyles.inputLabel}>
                  <Ionicons name="key" size={16} color="#10518b" /> 
                  {' '}Contraseña<Text style={registerStyles.requiredStar}> *</Text>
                </Text>
                <View style={registerStyles.inputIconContainer}>
                  <Ionicons name="key" size={22} color="#5faeee" />
                </View>
                <TextInput 
                  style={[
                    registerStyles.input,
                    isFocused.password && registerStyles.inputFocused,
                    password && password.length >= 8 ? registerStyles.inputValid : 
                    password ? registerStyles.inputError : {}
                  ]}
                  placeholder=""
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  editable={!loading}
                />
                {password && password.length < 8 && (
                  <Text style={registerStyles.errorText}>Mínimo 8 caracteres requeridos</Text>
                )}
              </View>

              {/* Input de Confirmar Contraseña */}
              <View style={registerStyles.inputContainer}>
                <Text style={registerStyles.inputLabel}>
                  <Ionicons name="key-outline" size={16} color="#10518b" /> 
                  {' '}Confirmar Contraseña<Text style={registerStyles.requiredStar}> *</Text>
                </Text>
                <View style={registerStyles.inputIconContainer}>
                  <Ionicons name="key-outline" size={22} color="#5faeee" />
                </View>
                <TextInput 
                  style={[
                    registerStyles.input,
                    isFocused.confirmPassword && registerStyles.inputFocused,
                    confirmPassword && password === confirmPassword ? registerStyles.inputValid : 
                    confirmPassword ? registerStyles.inputError : {}
                  ]}
                  placeholder=""
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                  editable={!loading}
                />
                {confirmPassword && password !== confirmPassword && (
                  <Text style={registerStyles.errorText}>Las contraseñas no coinciden</Text>
                )}
              </View>

              {/* Requisitos de contraseña */}
              <View style={registerStyles.passwordRequirements}>
                <Text style={registerStyles.requirementsTitle}>
                  <Ionicons name="shield-checkmark" size={16} color="#10518b" /> 
                  {' '}Requisitos de Seguridad:
                </Text>
                <Text style={[
                  registerStyles.requirementText,
                  password.length >= 8 ? registerStyles.requirementMet : registerStyles.requirementUnmet
                ]}>
                  {password.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
                </Text>
                <Text style={[
                  registerStyles.requirementText,
                  password === confirmPassword && confirmPassword ? registerStyles.requirementMet : registerStyles.requirementUnmet
                ]}>
                  {password === confirmPassword && confirmPassword ? '✓' : '○'} Las contraseñas coinciden
                </Text>
                <Text style={[
                  registerStyles.requirementText,
                  cedula.length === 10 ? registerStyles.requirementMet : registerStyles.requirementUnmet
                ]}>
                  {cedula.length === 10 ? '✓' : '○'} Cédula válida (10 dígitos)
                </Text>
                <Text style={[
                  registerStyles.requirementText,
                  telefono.length === 10 ? registerStyles.requirementMet : registerStyles.requirementUnmet
                ]}>
                  {telefono.length === 10 ? '✓' : '○'} Teléfono válido (10 dígitos)
                </Text>
              </View>

              {/* Botón de Registro con efectos */}
              <TouchableOpacity 
                style={[
                  registerStyles.button,
                  (!isFormValid || loading) && registerStyles.buttonDisabled
                ]} 
                onPress={handleRegister} 
                disabled={!isFormValid || loading}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isFormValid ? ['#5faeee', '#3b8fd9', '#10518b'] : ['#cbd5e1', '#94a3b8']}
                  style={registerStyles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                
                {/* Efecto shine animado */}
                {isFormValid && !loading && (
                  <Animated.View 
                    style={[
                      registerStyles.buttonShine,
                      { transform: [{ translateX: buttonShinePosition }] }
                    ]} 
                  />
                )}
                
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="large" />
                ) : (
                  <Text style={registerStyles.buttonText}>
                    <Ionicons name="checkmark-circle" size={22} color="#ffffff" /> 
                    {'  '}CREAR MI CUENTA
                  </Text>
                )}
              </TouchableOpacity>

              {/* Link de login */}
              <View style={registerStyles.loginContainer}>
                <Text style={registerStyles.loginText}>
                  ¿Ya tienes una cuenta?
                </Text>
                <TouchableOpacity 
                  onPress={() => router.back()}
                  disabled={loading}
                  activeOpacity={0.6}
                >
                  <LinearGradient
                    colors={['rgba(16, 81, 139, 0.1)', 'rgba(95, 174, 238, 0.2)']}
                    style={registerStyles.loginLink}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={{
                      color: '#10518b',
                      fontWeight: '800',
                      fontSize: 15,
                    }}>
                      <Ionicons name="log-in" size={15} /> 
                      {' '}Iniciar Sesión
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}