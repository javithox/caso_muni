@Entity
@Table(name="reportes")
public class Reporte {

    @Id
    @GeneratedValue(strategy =
        GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String descripcion;

    private Double latitud;

    private Double longitud;

}