# Justificación del proyecto

## Contexto

El cultivo de café constituye una actividad de gran importancia económica y productiva en Colombia y en otros países de la región. Su relevancia no solo radica en el valor comercial del grano, sino también en el impacto social que tiene sobre miles de familias que dependen de esta cadena productiva. En ese contexto, la sanidad del cultivo se convierte en un factor determinante, ya que las enfermedades foliares y las plagas pueden afectar el desarrollo de la planta, disminuir el rendimiento y comprometer la calidad de la producción.

Diversos trabajos del estado del arte coinciden en que la detección temprana de enfermedades en café es un problema vigente y de alto interés para la investigación en visión computacional. La literatura revisada muestra que las soluciones basadas en imágenes se han convertido en una alternativa prometedora para identificar alteraciones visuales en las hojas, especialmente cuando se busca apoyar el diagnóstico en condiciones de campo. En particular, los estudios recientes resaltan la roya, la phoma y otras afectaciones foliares como problemas recurrentes y de alto impacto en el cultivo.

A partir de este panorama, el presente proyecto se orienta al desarrollo de un sistema de detección automática de enfermedades en hojas de café mediante visión computacional. Su objetivo no es únicamente automatizar una tarea, sino aportar una herramienta que contribuya al monitoreo fitosanitario y a la toma de decisiones tempranas en el cultivo.

## Problema identificado

El problema identificado consiste en la dificultad de detectar de manera oportuna y confiable las enfermedades que aparecen en las hojas de café. En la práctica, el diagnóstico tradicional depende en gran medida de la inspección visual manual realizada por personas con experiencia agronómica, lo cual implica tiempo, conocimiento especializado y disponibilidad de personal capacitado. Este enfoque es además poco escalable para áreas amplias de cultivo y puede verse afectado por la subjetividad del observador.

La complejidad del problema aumenta porque muchas enfermedades foliares presentan síntomas visuales que pueden confundirse entre sí, sobre todo en etapas tempranas. La roya, el minador y la phoma producen alteraciones visibles en la hoja, pero estas no siempre son fáciles de distinguir a simple vista, especialmente cuando existen variaciones de iluminación, ángulo de captura, fondo o grado de avance de la afectación. Por ello, se requiere una solución que permita observar patrones visuales con mayor consistencia y apoyo computacional.

Además, el problema no se limita a saber si una imagen corresponde a una condición sana o enferma. En un escenario agrícola, también es importante reconocer qué parte de la hoja presenta la alteración, porque esa información aporta mayor claridad para la inspección y el seguimiento. Esta necesidad hace que el problema sea especialmente adecuado para un enfoque de detección y no solo de clasificación.

## Necesidad / Impacto del caso de estudio

La necesidad principal de este caso de estudio es fortalecer la detección temprana como estrategia preventiva. En agricultura, identificar síntomas cuando apenas aparecen permite actuar antes de que la enfermedad se propague o se agrave, lo que puede reducir pérdidas productivas y evitar intervenciones más costosas. En el caso del café, esta necesidad es aún más relevante porque las enfermedades foliares y las plagas pueden afectar directamente el estado general del cultivo y su productividad futura.

El impacto potencial de una solución como esta radica en su capacidad para acercar herramientas de diagnóstico a usuarios que no siempre cuentan con acceso inmediato a expertos agrónomos. Una aplicación basada en visión computacional puede funcionar como apoyo para campesinos, técnicos o personas encargadas del monitoreo del cultivo, facilitando una revisión inicial rápida y objetiva desde un dispositivo móvil o una interfaz web. De esta manera, la tecnología puede contribuir a democratizar el acceso al diagnóstico fitosanitario.

También existe un impacto importante en términos de prevención y manejo del cultivo. Al identificar enfermedades en la hoja, el sistema ayuda a priorizar inspecciones, reducir la incertidumbre en campo y orientar decisiones de control de forma más temprana. La revisión del estado del arte muestra que este tipo de soluciones se alinea con una tendencia clara hacia el monitoreo inteligente, el uso de herramientas accesibles y el despliegue en entornos reales de producción agrícola.

## Pertinencia de la vision computacional

La visión computacional es pertinente porque las enfermedades objetivo se manifiestan visualmente en la superficie de la hoja. Esto significa que el problema puede formularse como un análisis de patrones en imágenes, donde el modelo aprende a reconocer características como textura, color, forma, bordes, manchas o lesiones. En este caso, la información visual contiene la evidencia necesaria para apoyar la detección automática.

A diferencia de otros enfoques más tradicionales, la visión computacional permite automatizar la inspección de grandes cantidades de imágenes de forma objetiva y consistente. Esto resulta especialmente útil en contextos agrícolas, donde el diagnóstico manual puede ser lento y dependiente del criterio de cada observador. Además, cuando el sistema está diseñado para detección, no solo asigna una etiqueta a la imagen, sino que también señala las regiones donde encuentra la posible afectación, lo que añade interpretabilidad al proceso.

La elección de detección, y no únicamente de clasificación, es coherente con el propósito preventivo del proyecto. Clasificar una imagen solo indica si pertenece a una categoría, mientras que detectar permite ubicar visualmente la lesión dentro de la hoja. Esa localización es valiosa porque facilita comprender qué observa el modelo y cómo se relaciona su salida con el daño real en la planta. En otras palabras, la detección aporta una lectura más útil para el contexto agrícola.

La selección de YOLOv8 también es pertinente por razones técnicas y de aplicación. En el estado del arte, los detectores de una sola etapa y los modelos ligeros han ganado relevancia en problemas agrícolas porque equilibran precisión, velocidad y posibilidad de despliegue en campo. YOLOv8 se ajusta bien a este escenario por su enfoque de detección en una sola pasada y por su flexibilidad para trabajar con versiones más livianas, lo que favorece su integración en soluciones portables como una PWA.

## Justificación de las clases

Las clases seleccionadas para este proyecto —healthy, miner, phoma y rust— responden a un criterio de pertinencia agronómica y de disponibilidad de información visual suficiente para el entrenamiento. No se eligieron de manera arbitraria, sino porque representan condiciones frecuentes y relevantes dentro del contexto de enfermedades y afectaciones foliares del café.

La clase healthy es necesaria porque define el estado de referencia de una hoja sana. Incluir esta categoría permite contrastar visualmente las hojas sin afectación frente a las hojas con síntomas, lo cual es esencial para un sistema de diagnóstico. Sin esta clase, el modelo solo aprendería a reconocer daño, pero no tendría un punto de comparación claro para distinguir el estado normal del cultivo.

La clase rust se justifica porque la roya es una de las enfermedades más importantes del café y una de las más recurrentemente tratadas en el estado del arte. Su inclusión es fundamental debido a su impacto en la productividad y a que suele ser prioritaria en cualquier estrategia de monitoreo fitosanitario. La literatura reciente la identifica como uno de los principales objetivos de la detección automática en hojas de café.

La clase miner también resulta importante porque representa un tipo de daño foliar que afecta directamente la superficie de la hoja y que puede confundirse con otras alteraciones visuales. Incluirla amplía la utilidad del sistema, ya que no se limita a enfermedades fúngicas, sino que también cubre una afectación frecuente en cultivos de café que requiere atención temprana.

Finalmente, la clase phoma se incorpora porque es otra enfermedad foliar relevante dentro del cultivo y aparece de forma recurrente en datasets y estudios sobre café. Su presencia en el conjunto de clases permite que el sistema cubra un espectro más representativo de problemas visuales comunes en campo. De esta forma, la selección de clases equilibra utilidad práctica, representatividad del dominio y viabilidad de entrenamiento.

En conjunto, estas clases permiten formular un problema concreto y bien delimitado, alineado con una necesidad real del cultivo de café y con las capacidades de la visión computacional para detectar patrones visuales en imágenes. Esa coherencia entre problema, datos y técnica es lo que hace que la propuesta sea pertinente desde el punto de vista académico y aplicable desde el punto de vista práctico.