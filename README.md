# Tangram

A simplified Tangram game made with three.js
## Rotacao
![vector](./asset/vectors.png)

Primeiramente, calculamos o angulo entre os vetores $\theta$ que sao construidos da seguinte maneira:
$\vec{v} = \vec{cursor} - \vec{centerMesh}$

Utilizando o arco cosseno, encontramos o angulo entre 0 e 180 em radiano.  
Alem disso, eh analisado o sinal do produto vetorial entre o antigo vetor posicao e o novo para saber se girou em sentido horario ou anti-horario